// index.js — PCForge Entry Point
import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import mongoose from 'mongoose';
import http from 'http';
import https from 'https';
import { playCommand } from './commands/play.js';
import { handleInteraction } from './handlers/interactionHandler.js';
import Player from './models/Player.js';
import { marketEvents, COOLDOWNS } from './game/config.js';
import { rollEvent } from './game/events.js';
import { applyWear, calculateEarnings, addXp } from './handlers/economyHandler.js';
import { XP_REWARDS } from './game/config.js';

// ── Keep-alive for Render ──────────────────────────────
setInterval(() => {
  https.get(process.env.RENDER_URL, (res) => {
    console.log(`Keep-alive ping: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Keep-alive error:', err.message);
  });
}, 60 * 1000);

// ── Discord client ─────────────────────────────────────────────────
const client = new Client({
  intents: [GatewayIntentBits.Guilds]  // GuildMessages + MessageContent not needed for slash commands, and they error in DMs
});

// ── Cooldown map (in-memory, per user) ────────────────────────────
export const cooldowns = new Collection();

// ── MongoDB ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Register slash commands ────────────────────────────────────────
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const commands = [playCommand.data.toJSON()];
  try {
    if (process.env.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      console.log('✅ Slash commands registered (guild)');
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('✅ Slash commands registered (global)');
    }
  } catch (err) {
    console.error('❌ Command registration error:', err);
  }
}

// ── Market rotation (stored per-server in a simple in-memory tracker) ─
let currentMarketEvent = null;
let marketExpiresAt = null;

export function getMarketState() {
  if (!currentMarketEvent || !marketExpiresAt || new Date() > marketExpiresAt) {
    rotateMarket();
  }
  return { eventId: currentMarketEvent.id, expiresAt: marketExpiresAt };
}

function rotateMarket() {
  const weights = marketEvents.map((_, i) => (i === marketEvents.length - 1 ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let rnd = Math.random() * total;
  let idx = 0;
  for (let i = 0; i < weights.length; i++) {
    rnd -= weights[i];
    if (rnd <= 0) { idx = i; break; }
  }
  currentMarketEvent = marketEvents[idx];
  marketExpiresAt = new Date(Date.now() + currentMarketEvent.duration * 3600 * 1000);
  console.log(`📈 Market event rotated: ${currentMarketEvent.name} for ${currentMarketEvent.duration}h`);
}

// Rotate market every 2 hours
setInterval(rotateMarket, COOLDOWNS.marketRotation);
rotateMarket();

// ── Hourly background tick: wear + events + karma ──────────────────
async function hourlyTick() {
  console.log('⏰ Hourly tick running...');
  const players = await Player.find({});
  const marketState = getMarketState();

  for (const player of players) {
    let modified = false;

    for (const pc of player.pcs) {
      if (!pc.built || !pc.task || pc.task === 'idle' || !pc.online) continue;
      if (pc.offlineUntil && new Date() < new Date(pc.offlineUntil)) continue;

      // Apply wear
      const newWear = applyWear(pc, 1);
      pc.wear = newWear;
      modified = true;

      // Karma for protein folding
      const { tasks } = await import('./game/tasks.js');
      const task = tasks[pc.task];
      if (task?.karmaPerHour) {
        player.karmaPoints += task.karmaPerHour;
      }

      // Roll random events
      const triggeredEvents = rollEvent(task?.riskLevel || 0, pc.task);
      for (const event of triggeredEvents) {
        await applyEventEffect(event, pc, player);
      }
    }

    if (modified) {
      await player.save().catch(err => console.error('Hourly tick save error:', err));
    }
  }
}

async function applyEventEffect(event, pc, player) {
  const { parts: PARTS } = await import('./game/parts.js');

  switch (event.effect) {
    case 'WEAR_DAMAGE_20_GPU':
      pc.wear.gpu = Math.min(100, (pc.wear.gpu || 0) + 20);
      break;
    case 'PC_OFFLINE_1HR':
      pc.offlineUntil = new Date(Date.now() + 3600 * 1000);
      break;
    case 'GPU_TASKS_OFFLINE_30MIN':
      if (['bitcoin_mining','ethereum_mining','render_farm','deepfake_factory','nft_minting'].includes(pc.task)) {
        pc.offlineUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      break;
    case 'PSU_WEAR_30':
      pc.wear.psu = Math.min(100, (pc.wear.psu || 0) + 30);
      break;
    case 'WEAR_HEAL_ALL_20':
      for (const comp of Object.keys(pc.wear)) {
        pc.wear[comp] = Math.max(0, (pc.wear[comp] || 0) - 20);
      }
      break;
    case 'EARNINGS_2X_2HR':
      pc.activeBoost = { type: 'EARNINGS_2X_2HR', expiresAt: new Date(Date.now() + 2 * 3600 * 1000), multiplier: 2.0 };
      break;
    case 'MINING_2X_4HR':
      pc.activeBoost = { type: 'MINING_2X_4HR', expiresAt: new Date(Date.now() + 4 * 3600 * 1000), multiplier: 2.0 };
      break;
    case 'LOSE_EARNINGS':
      // Wipe pending earnings by resetting lastCollected
      pc.lastCollected = new Date();
      break;
    case 'ADD_RANDOM_PART': {
      const partList = Object.values(PARTS).filter(p => ['budget','midrange'].includes(p.tier));
      if (partList.length > 0) {
        const randPart = partList[Math.floor(Math.random() * partList.length)];
        player.inventory.push({ partId: randPart.id, wear: 0, acquired: new Date() });
      }
      break;
    }
    case 'PART_FAIL_RANDOM': {
      const equipped = Object.values(pc.parts).filter(Boolean);
      if (equipped.length > 0) {
        const failSlot = Object.keys(pc.parts)[Math.floor(Math.random() * Object.keys(pc.parts).filter(k => pc.parts[k]).length)];
        pc.wear[failSlot] = 100;
      }
      break;
    }
  }
}

setInterval(hourlyTick, 3600 * 1000);

// ── Discord event: ready ───────────────────────────────────────────
client.once('ready', async () => {
  console.log(`✅ PCForge online as ${client.user.tag}`);
  await registerCommands();
});

// ── Discord event: slash command ───────────────────────────────────
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'play') {
    await playCommand.execute(interaction);
    return;
  }
  if (interaction.isButton() || interaction.isStringSelectMenu()) {
    await handleInteraction(interaction);
  }
});

client.on('error', err => console.error('Discord client error:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

client.login(process.env.DISCORD_TOKEN);
