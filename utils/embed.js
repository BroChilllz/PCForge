// utils/embed.js
import { EmbedBuilder } from 'discord.js';
import { TIER_COLORS, STATUS_COLORS } from '../game/config.js';
import { formatMoney, wearBar, tierEmoji, statusEmoji, formatScore } from './format.js';
import { parts as PARTS } from '../game/parts.js';
import { tasks as TASKS } from '../game/tasks.js';

export function footer(player) {
  return { text: `PCForge v1.0 • Your wallet: ${formatMoney(player?.wallet ?? 0)}` };
}

export function mainMenuEmbed(player) {
  return new EmbedBuilder()
    .setTitle('⚡ PCForge — Main Menu')
    .setDescription(
      `Welcome back, **${player.username || 'Builder'}**!\n` +
      `💰 Wallet: **${formatMoney(player.wallet)}** | 🏦 Bank: **${formatMoney(player.bank)}**\n` +
      `⭐ Level ${player.level} | 🏆 Prestige ${player.prestige}`
    )
    .setColor(0x5865F2)
    .setFooter(footer(player))
    .setTimestamp();
}

export function profileEmbed(player) {
  const { xpBar } = require('./format.js');
  const { XP_THRESHOLDS } = require('../game/config.js');
  const nextXp = XP_THRESHOLDS[player.level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const { xpBar: xpBarFn, shortNum, tierLabel } = require('./format.js');

  // Build dynamically
  return new EmbedBuilder()
    .setTitle('📊 Profile')
    .setColor(0x5865F2)
    .addFields(
      { name: '👤 Player', value: player.username || 'Unknown', inline: true },
      { name: '⭐ Level', value: String(player.level), inline: true },
      { name: '🏆 Prestige', value: String(player.prestige), inline: true },
      { name: '💰 Wallet', value: formatMoney(player.wallet), inline: true },
      { name: '🏦 Bank', value: formatMoney(player.bank), inline: true },
      { name: '🌟 Karma', value: String(player.karmaPoints), inline: true },
      { name: '📈 Lifetime Earned', value: formatMoney(player.totalLifetimeEarned), inline: true },
      { name: '🎒 Parts Owned', value: String(player.inventory.length), inline: true }
    )
    .setFooter(footer(player))
    .setTimestamp();
}

export function pcSlotEmbed(player, pc) {
  const embed = new EmbedBuilder()
    .setTitle(`🖥️ PC Slot ${pc.slot} — ${pc.name || `Slot ${pc.slot}`}`)
    .setFooter(footer(player))
    .setTimestamp();

  if (!pc.built) {
    embed.setDescription('⚪ **Empty Slot** — No PC built yet.\nUse **Build PC** to get started!')
      .setColor(0x808080);
    return embed;
  }

  const isOffline = !pc.online || (pc.offlineUntil && new Date() < new Date(pc.offlineUntil));
  embed.setColor(isOffline ? STATUS_COLORS.offline : STATUS_COLORS.online);

  const task = pc.task && pc.task !== 'idle' ? TASKS[pc.task] : null;

  const fields = [];
  for (const [slot, partId] of Object.entries(pc.parts)) {
    if (!partId) continue;
    const part = PARTS[partId];
    if (!part) continue;
    const wearVal = pc.wear[slot] ?? 0;
    fields.push({
      name: `${tierEmoji(part.tier)} ${capitalize(slot)}: ${part.name}`,
      value: `Wear: ${wearBar(wearVal)}`,
      inline: true
    });
  }

  embed.setDescription(
    `**Status:** ${statusEmoji(pc)} ${isOffline ? '🔴 Offline' : (task ? `🟢 Running: ${task.emoji} ${task.name}` : '🟡 Idle')}\n` +
    `**Task:** ${task ? `${task.emoji} ${task.name}` : 'None (Idle)'}\n` +
    `**Total Earned:** ${formatMoney(pc.totalEarned)}`
  );

  if (fields.length > 0) embed.addFields(fields.slice(0, 6));

  return embed;
}

export function partDetailEmbed(player, part) {
  const embed = new EmbedBuilder()
    .setTitle(`${tierEmoji(part.tier)} ${part.name}`)
    .setDescription(part.flavor + (part.lore ? `\n\n*${part.lore}*` : ''))
    .setColor(TIER_COLORS[part.tier] || 0x808080)
    .addFields(
      { name: '💰 Price', value: formatMoney(part.price), inline: true },
      { name: '💸 Sell Price', value: formatMoney(part.sellPrice), inline: true },
      { name: '⭐ Tier', value: capitalize(part.tier), inline: true },
      { name: '📊 Performance Score', value: formatScore(part.score), inline: true },
      { name: '🔒 Level Required', value: String(part.levelRequired), inline: true }
    )
    .setFooter(footer(player))
    .setTimestamp();

  if (part.specs) {
    const specLines = Object.entries(part.specs).map(([k, v]) => `**${capitalize(k)}:** ${v}`).join('\n');
    embed.addFields({ name: '📋 Specs', value: specLines.substring(0, 1024) });
  }

  return embed;
}

export function errorEmbed(message) {
  return new EmbedBuilder()
    .setTitle('❌ Error')
    .setDescription(message)
    .setColor(0xff0000)
    .setTimestamp();
}

export function successEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setColor(0x00ff00)
    .setTimestamp();
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
