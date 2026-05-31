// handlers/interactionHandler.js — Routes all button/select interactions
import Player from '../models/Player.js';
import { parts as PARTS, getPartsByCategory } from '../game/parts.js';
import { tasks as TASKS } from '../game/tasks.js';
import { COOLDOWNS, XP_REWARDS, marketEvents } from '../game/config.js';
import { cooldowns, getMarketState } from '../index.js';
import { calculateEarnings, applyWear, addXp } from './economyHandler.js';
import {
  renderMainMenu, renderShopCategories, renderShopCategory, renderPartDetail,
  renderPcList, renderPcDetail, renderInventory, renderInventoryItemAction,
  renderProfile, renderMarket, renderLeaderboard, renderTasksMenu
} from './menuHandler.js';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { formatMoney, tierEmoji, wearBar, shortNum, statusEmoji } from '../utils/format.js';

// ── Cooldown check ─────────────────────────────────────────────────
function checkCooldown(userId) {
  const now = Date.now();
  const last = cooldowns.get(userId) || 0;
  if (now - last < COOLDOWNS.interaction) {
    return Math.ceil((COOLDOWNS.interaction - (now - last)) / 1000);
  }
  cooldowns.set(userId, now);
  return 0;
}

function errEmbed(msg) {
  return new EmbedBuilder().setTitle('❌ Error').setDescription(msg).setColor(0xff0000);
}

function successEmbed(title, desc) {
  return new EmbedBuilder().setTitle(`✅ ${title}`).setDescription(desc).setColor(0x00ff00).setTimestamp();
}

// ── Main router ────────────────────────────────────────────────────
export async function handleInteraction(interaction) {
  console.log('interaction id:', interaction.customId);
  const cd = checkCooldown(interaction.user.id);
  if (cd > 0) {
    return interaction.reply({ embeds: [errEmbed(`⏱️ Slow down! Wait **${cd}s**.`)], ephemeral: true });
  }

  await interaction.deferUpdate().catch(() => {});

  try {
    let player = await Player.findOne({ userId: interaction.user.id });
    if (!player) {
      player = new Player({
        userId: interaction.user.id,
        username: interaction.user.username
      });
      await player.save();
    }
    player.username = interaction.user.username;
    const marketState = getMarketState();
    const id = interaction.customId;

    // ── Main menu nav ──────────────────────────────────────────────
    if (id === 'menu_main') return interaction.editReply(renderMainMenu(player));
    if (id === 'menu_pcs') return interaction.editReply(renderPcList(player));
    if (id === 'menu_shop') return interaction.editReply(renderShopCategories(player));
    if (id === 'menu_inventory') return interaction.editReply(renderInventory(player, 'all', 0));
    if (id === 'menu_profile') return interaction.editReply(renderProfile(player));
    if (id === 'menu_tasks') return interaction.editReply(renderTasksMenu(player));
    if (id === 'menu_market') return interaction.editReply(renderMarket(player, marketState));
    if (id === 'menu_leaderboard') return handleLeaderboard(interaction, player, 'richest');
    if (id === 'menu_events') return handleEventsMenu(interaction, player);
    if (id === 'menu_scavenge') return handleScavenge(interaction, player);

    // ── Shop ───────────────────────────────────────────────────────
    if (id === 'shop_cat_back') return interaction.editReply(renderShopCategories(player));
    if (id.startsWith('shop_cat_') && !id.startsWith('shop_cat_back')) {
      const parts = id.replace('shop_cat_', '').split('_');
      const page = isNaN(parts[parts.length - 1]) ? 0 : parseInt(parts.pop());
      const cat = parts.join('_');
      return interaction.editReply(renderShopCategory(player, cat, page));
    }
    if (id.startsWith('shop_page_')) {
      const parts2 = id.split('_'); // shop_page_<cat>_<page>
      const page = parseInt(parts2[parts2.length - 1]);
      const cat = parts2.slice(2, -1).join('_');
      return interaction.editReply(renderShopCategory(player, cat, page));
    }
    if (id === 'shop_category_select' && interaction.isStringSelectMenu()) {
      const val = interaction.values[0]; // shop_cat_<cat>
      const cat = val.replace('shop_cat_', '');
      return interaction.editReply(renderShopCategory(player, cat, 0));
    }
    if (id.startsWith('shop_item_select_') && interaction.isStringSelectMenu()) {
      const partId = interaction.values[0].replace('shopbuy_', '');
      const part = PARTS[partId];
      if (!part) return interaction.editReply({ embeds: [errEmbed('Part not found.')], components: [] });
      return interaction.editReply(renderPartDetail(player, part, 'shop'));
    }
    if (id.startsWith('shop_confirm_buy_')) {
      const partId = id.replace('shop_confirm_buy_', '');
      return handleBuyPart(interaction, player, partId);
    }

    // ── PC Slots ───────────────────────────────────────────────────
    if (id.startsWith('pc_slot_')) {
      const slot = parseInt(id.replace('pc_slot_', ''));
      const pc = player.pcs.find(p => p.slot === slot) || { slot, built: false };
      return interaction.editReply(renderPcDetail(player, pc, marketState));
    }
    if (id.startsWith('pc_build_')) {
      const slot = parseInt(id.replace('pc_build_', ''));
      return handleBuildPcStart(interaction, player, slot);
    }
    if (id.startsWith('pc_collect_')) {
      const slot = parseInt(id.replace('pc_collect_', ''));
      return handleCollect(interaction, player, slot, marketState);
    }
    if (id.startsWith('pc_assign_task_')) {
      const slot = parseInt(id.replace('pc_assign_task_', ''));
      const pc = player.pcs.find(p => p.slot === slot);
      if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [] });
      return handleTaskAssignMenu(interaction, player, pc);
    }
    if (id.startsWith('pc_upgrade_')) {
      const slot = parseInt(id.replace('pc_upgrade_', ''));
      return handleUpgradeMenu(interaction, player, slot);
    }
    if (id === 'upgrade_component_select' && interaction.isStringSelectMenu()) {
      return handleUpgradeComponentSelect(interaction, player);
    }
    if (id.startsWith('upgrade_confirm_') && interaction.isStringSelectMenu()) {
      return handleUpgradePartSelect(interaction, player);
    }
    if (id.startsWith('pc_dismantle_')) {
      const slot = parseInt(id.replace('pc_dismantle_', ''));
      return handleDismantleConfirm(interaction, player, slot);
    }
    if (id.startsWith('pc_dismantle_confirm_')) {
      const slot = parseInt(id.replace('pc_dismantle_confirm_', ''));
      return handleDismantle(interaction, player, slot);
    }
    if (id.startsWith('pc_rename_')) {
      const slot = parseInt(id.replace('pc_rename_', ''));
      return handleRenamePrompt(interaction, player, slot);
    }
    if (id.startsWith('pc_rename_set_')) {
      // pc_rename_set_<slot>_<name>
      const rest = id.replace('pc_rename_set_', '');
      const underscore = rest.indexOf('_');
      const slot = parseInt(rest.substring(0, underscore));
      const newName = rest.substring(underscore + 1);
      return handleRenameSet(interaction, player, slot, newName);
    }

    // ── PC Build flow (select menus) ───────────────────────────────
    if (id.startsWith('build_select_') && interaction.isStringSelectMenu()) {
      return handleBuildSelect(interaction, player, id);
    }
    if (id.startsWith('build_do_')) {
      const slot = parseInt(id.replace('build_do_', ''));
      const freshPlayer = await Player.findOne({ userId: interaction.user.id });
      if (!freshPlayer.pendingBuild || freshPlayer.pendingBuild.slot !== slot) {
        return interaction.editReply({ embeds: [errEmbed('Build session expired. Please start over.')], components: [backRow(`pc_slot_${slot}`)] });
      }
      const selectedParts = freshPlayer.pendingBuild.parts.toObject();
      freshPlayer.pendingBuild = null;
      return executeBuild(interaction, freshPlayer, slot, selectedParts);
    }

    // ── Inventory ──────────────────────────────────────────────────
    if (id.startsWith('menu_inventory_') || id.startsWith('inv_filter_')) {
      const parts3 = id.replace('menu_inventory_', '').replace('inv_filter_', '').split('_');
      const cat = parts3[0] || 'all';
      const page = parseInt(parts3[1] || '0');
      return interaction.editReply(renderInventory(player, cat, page));
    }
    if (id.startsWith('inv_item_')) {
      const idx = parseInt(id.replace('inv_item_', ''));
      return interaction.editReply(renderInventoryItemAction(player, idx));
    }
    if (id.startsWith('inv_sell_')) {
      const idx = parseInt(id.replace('inv_sell_', ''));
      return handleSellPart(interaction, player, idx);
    }
    if (id.startsWith('inv_equip_')) {
      const idx = parseInt(id.replace('inv_equip_', ''));
      return handleEquipMenu(interaction, player, idx);
    }
    if (id.startsWith('inv_equip_pc_') && interaction.isStringSelectMenu()) {
      return handleEquipToPc(interaction, player, id);
    }

    // ── Profile / Bank / Prestige ──────────────────────────────────
    if (id === 'profile_bank') return handleBankMenu(interaction, player);
    if (id === 'bank_deposit_all') return handleBankDeposit(interaction, player, 'all');
    if (id === 'bank_withdraw_all') return handleBankWithdraw(interaction, player, 'all');
    if (id === 'bank_deposit_half') return handleBankDeposit(interaction, player, 'half');
    if (id === 'bank_withdraw_half') return handleBankWithdraw(interaction, player, 'half');
    if (id === 'profile_prestige') return handlePrestige(interaction, player);
    if (id === 'profile_prestige_locked') {
      return interaction.editReply({ embeds: [errEmbed('You need to be Level 20+ and have owned an Exotic+ part to prestige.')], components: [backRow('menu_profile')] });
    }

    // ── Tasks ──────────────────────────────────────────────────────
    if (id === 'tasks_pc_select' && interaction.isStringSelectMenu()) {
      const val = interaction.values[0]; // tasks_assign_pc_<slot>
      const slot = parseInt(val.replace('tasks_assign_pc_', ''));
      const pc = player.pcs.find(p => p.slot === slot);
      if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [] });
      return handleTaskAssignMenu(interaction, player, pc);
    }
    if (id === 'tasks_assign_select' && interaction.isStringSelectMenu()) {
      return handleTaskAssign(interaction, player);
    }

    // ── Leaderboard ────────────────────────────────────────────────
    if (id === 'leaderboard_type_select' && interaction.isStringSelectMenu()) {
      const type = interaction.values[0].replace('lb_', '');
      return handleLeaderboard(interaction, player, type);
    }

  } catch (err) {
    console.error('Interaction error:', err);
    try {
      await interaction.editReply({ embeds: [errEmbed('An error occurred. Please try again.')], components: [] });
    } catch {}
  }
}

// ── Helper: back button row ────────────────────────────────────────
function backRow(customId, label = '← Back') {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(ButtonStyle.Secondary)
  );
}

// ── Buy part ──────────────────────────────────────────────────────
async function handleBuyPart(interaction, player, partId) {
  const part = PARTS[partId];
  if (!part) return interaction.editReply({ embeds: [errEmbed('Part not found.')], components: [] });
  if (player.wallet < part.price) {
    return interaction.editReply({ embeds: [errEmbed(`Not enough money. You need ${formatMoney(part.price)} but have ${formatMoney(player.wallet)}.`)], components: [backRow(`shop_cat_${part.category}_0`)] });
  }
  if (part.levelRequired > player.level) {
    return interaction.editReply({ embeds: [errEmbed(`Requires Level ${part.levelRequired}.`)], components: [backRow(`shop_cat_${part.category}_0`)] });
  }
  player.wallet -= part.price;
  player.inventory.push({ partId: part.id, wear: 0, acquired: new Date() });
  const { leveled, newLevel } = addXp(player, XP_REWARDS.buyPart);
  await player.save();

  const embed = successEmbed('Purchase Successful',
    `You bought **${part.name}** for ${formatMoney(part.price)}!\n` +
    `+${XP_REWARDS.buyPart} XP earned${leveled ? ` 🎉 Level up! Now Level **${newLevel}**!` : ''}\n` +
    `New wallet: ${formatMoney(player.wallet)}`
  );
  return interaction.editReply({ embeds: [embed], components: [backRow(`shop_cat_${part.category}_0`)] });
}

// ── Collect earnings ──────────────────────────────────────────────
async function handleCollect(interaction, player, slot, marketState) {
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [backRow('menu_pcs')] });

  const earnings = calculateEarnings(pc, player, marketState);
  if (earnings <= 0) {
    return interaction.editReply({
      embeds: [errEmbed('No earnings to collect. PC may be idle, offline, or fully worn out.')],
      components: [backRow(`pc_slot_${slot}`)]
    });
  }

  const hoursElapsed = (Date.now() - new Date(pc.lastCollected).getTime()) / 3600000;
  pc.wear = applyWear(pc, Math.min(hoursElapsed, 24));
  player.wallet += earnings;
  player.totalLifetimeEarned = (player.totalLifetimeEarned || 0) + earnings;
  pc.totalEarned = (pc.totalEarned || 0) + earnings;
  pc.lastCollected = new Date();

  const { leveled, newLevel } = addXp(player, XP_REWARDS.collectEarnings);
  await player.save();

  const embed = successEmbed('Earnings Collected',
    `💰 **+${formatMoney(earnings)}** collected from **${pc.name || `PC Slot ${slot}`}**!\n` +
    `+${XP_REWARDS.collectEarnings} XP${leveled ? ` 🎉 Level **${newLevel}**!` : ''}\n` +
    `Wallet: ${formatMoney(player.wallet)}`
  );
  return interaction.editReply({ embeds: [embed], components: [backRow(`pc_slot_${slot}`)] });
}

// ── Scavenge ──────────────────────────────────────────────────────
async function handleScavenge(interaction, player) {
  const now = Date.now();
  const last = player.scavengeLastUsed ? new Date(player.scavengeLastUsed).getTime() : 0;
  const remaining = COOLDOWNS.scavenge - (now - last);

  if (remaining > 0) {
    const mins = Math.ceil(remaining / 60000);
    return interaction.editReply({ embeds: [errEmbed(`🔍 Scavenge on cooldown! Try again in **${mins} min**.`)], components: [backRow('menu_main')] });
  }

  player.scavengeLastUsed = new Date();
  const roll = Math.random();
  let embed;

  if (roll < 0.01) {
    // 1%: exotic part
    const exotics = Object.values(PARTS).filter(p => p.tier === 'exotic');
    const part = exotics[Math.floor(Math.random() * exotics.length)];
    player.inventory.push({ partId: part.id, wear: Math.floor(Math.random() * 30), acquired: new Date() });
    embed = successEmbed('🎉 INCREDIBLE FIND!', `You found a **${part.name}** (Exotic) in the dumpster! This is a one-in-a-hundred shot! ${part.flavor}`);
  } else if (roll < 0.05) {
    // 4%: highend part
    const highends = Object.values(PARTS).filter(p => p.tier === 'highend');
    const part = highends[Math.floor(Math.random() * highends.length)];
    player.inventory.push({ partId: part.id, wear: Math.floor(Math.random() * 40 + 10), acquired: new Date() });
    embed = successEmbed('🔥 Great Find!', `You found a **${part.name}** (High-End) with some wear. Score!`);
  } else if (roll < 0.15) {
    // 10%: nothing
    embed = new EmbedBuilder().setTitle('🔍 Scavenge Result').setDescription('The dumpster was empty. Even raccoons gave up.').setColor(0x808080);
  } else if (roll < 0.30) {
    // 15%: worn part
    const basics = Object.values(PARTS).filter(p => ['budget','midrange'].includes(p.tier));
    const part = basics[Math.floor(Math.random() * basics.length)];
    const wear = Math.floor(Math.random() * 30 + 40);
    player.inventory.push({ partId: part.id, wear, acquired: new Date() });
    embed = successEmbed('🔧 Worn Component', `Found a **${part.name}** at **${wear}% wear**. Not perfect, but free is free.`);
  } else if (roll < 0.60) {
    // 30%: random budget/midrange part
    const basics = Object.values(PARTS).filter(p => ['budget','midrange'].includes(p.tier));
    const part = basics[Math.floor(Math.random() * basics.length)];
    player.inventory.push({ partId: part.id, wear: 0, acquired: new Date() });
    embed = successEmbed('📦 Part Found!', `You dug up a **${part.name}**! Someone threw this away. Their loss.`);
  } else {
    // 40%: cash
    const cash = Math.floor(Math.random() * 70 + 10);
    player.wallet += cash;
    embed = successEmbed('💵 Found Cash!', `You found **${formatMoney(cash)}** between the couch cushions of a dumpster.`);
  }

  addXp(player, XP_REWARDS.scavenge);
  await player.save();
  return interaction.editReply({ embeds: [embed], components: [backRow('menu_main')] });
}

// ── Build PC flow ─────────────────────────────────────────────────
const BUILD_SLOTS = ['cpu', 'gpu', 'ram', 'storage', 'psu', 'motherboard', 'cooling', 'case'];

async function handleBuildPcStart(interaction, player, slot) {
  // Check if player has parts
  if (player.inventory.length === 0) {
    return interaction.editReply({ embeds: [errEmbed('Your inventory is empty. Buy parts in the Shop first!')], components: [backRow('menu_pcs')] });
  }

  return showBuildStep(interaction, player, slot, 'cpu', {});
}

function showBuildStep(interaction, player, slot, currentSlot, selected) {
  const remaining = BUILD_SLOTS.filter(s => !selected[s]);
  const owned = player.inventory.filter(i => {
    const p = PARTS[i.partId];
    return p && p.category === currentSlot;
  });

  if (owned.length === 0) {
    // Skip optional slots
    const optionalSlots = ['motherboard', 'cooling', 'case'];
    if (optionalSlots.includes(currentSlot)) {
      const nextSlot = getNextBuildSlot(currentSlot, selected);
      if (nextSlot) return showBuildStep(interaction, player, slot, nextSlot, selected);
      return showBuildConfirm(interaction, player, slot, selected);
    }
    return interaction.editReply({
      embeds: [errEmbed(`You don't have any **${currentSlot.toUpperCase()}** parts. Buy one from the shop first!`)],
      components: [backRow('menu_pcs')]
    });
  }

  const options = owned.slice(0, 25).map((item, i) => {
    const p = PARTS[item.partId];
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${p.name} — Score: ${p.score}`)
      .setValue(`${i}`) // inventory index within owned
      .setDescription(`${p.tier} | ${wearBar(item.wear || 0).substring(0, 50)}`)
      .setEmoji(tierEmoji(p.tier));
  });

  const embed = new EmbedBuilder()
    .setTitle(`🔨 Building PC — Slot ${slot}`)
    .setDescription(`**Select your ${currentSlot.toUpperCase()}** (${remaining.length} slots left to choose)\n\nAlready selected:\n${
      Object.entries(selected).map(([k, v]) => `• ${k.toUpperCase()}: ${PARTS[v]?.name}`).join('\n') || 'None yet'
    }`)
    .setColor(0x3498db);

  const select = new StringSelectMenuBuilder()
    .setCustomId(`build_select_${slot}_${currentSlot}`)
    .setPlaceholder(`Pick your ${currentSlot}...`)
    .addOptions(options);

  const skipOpts = ['motherboard', 'cooling', 'case'];
  const components = [new ActionRowBuilder().addComponents(select)];
  if (skipOpts.includes(currentSlot)) {
    components.push(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`build_skip_${slot}_${currentSlot}`).setLabel(`⏭️ Skip ${currentSlot}`).setStyle(ButtonStyle.Secondary)
    ));
  }
  components.push(new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`pc_slot_${slot}`).setLabel('← Cancel').setStyle(ButtonStyle.Danger)
  ));

  return interaction.editReply({ embeds: [embed], components });
}

function getNextBuildSlot(current, selected) {
  const remaining = BUILD_SLOTS.filter(s => s !== current && !selected[s]);
  return remaining[0] || null;
}

async function handleBuildSelect(interaction, player, customId) {
  // build_select_<slot>_<component>
  const parts = customId.replace('build_select_', '').split('_');
  const slot = parseInt(parts[0]);
  const component = parts.slice(1).join('_');
  const selectedIdx = parseInt(interaction.values[0]);

  // Get the selected part from owned parts of this category
  const owned = player.inventory.filter(i => {
    const p = PARTS[i.partId];
    return p && p.category === component;
  });
  const chosenItem = owned[selectedIdx];
  if (!chosenItem) return interaction.editReply({ embeds: [errEmbed('Selection error. Try again.')], components: [] });

  // We store selected as partId (not inventory index, since equipping pulls from inventory)
  // Re-parse any existing selection from the embed description
  const selectedParts = parseSelectedFromEmbed(interaction.message.embeds[0]);
  selectedParts[component] = chosenItem.partId;

  const next = getNextBuildSlot(component, selectedParts);
  if (next) {
    return showBuildStep(interaction, player, slot, next, selectedParts);
  }
  return showBuildConfirm(interaction, player, slot, selectedParts);
}

function parseSelectedFromEmbed(embed) {
  const selected = {};
  if (!embed?.description) return selected;
  const lines = embed.description.split('\n');
  for (const line of lines) {
    const match = line.match(/^• (\w+): (.+)$/);
    if (match) {
      const comp = match[1].toLowerCase();
      // Find the part by name
      const part = Object.values(PARTS).find(p => p.name === match[2]);
      if (part) selected[comp] = part.id;
    }
  }
  return selected;
}

async function showBuildConfirm(interaction, player, slot, selectedParts) {
  const lines = Object.entries(selectedParts).map(([k, v]) => {
    const p = PARTS[v];
    return `${tierEmoji(p?.tier)} **${k.toUpperCase()}:** ${p?.name || 'Unknown'}`;
  });

  // Save selection to DB instead of encoding in customId
  player.pendingBuild = { slot, parts: selectedParts };
  await player.save();

  const embed = new EmbedBuilder()
    .setTitle(`🔨 Confirm Build — Slot ${slot}`)
    .setDescription('Review your build:\n\n' + lines.join('\n'))
    .setColor(0x2ecc71);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`build_do_${slot}`).setLabel('✅ Build It').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`pc_slot_${slot}`).setLabel('← Cancel').setStyle(ButtonStyle.Danger)
      )
    ]
  });
}

async function executeBuild(interaction, player, slot, selectedParts) {
  console.log('executeBuild selectedParts:', JSON.stringify(selectedParts));
  console.log('inventory:', JSON.stringify(player.inventory.map(i => i.partId)));
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc) return interaction.editReply({ embeds: [errEmbed('PC slot not found.')], components: [] });
  if (pc.built) return interaction.editReply({ embeds: [errEmbed('Slot already has a PC. Dismantle it first.')], components: [backRow(`pc_slot_${slot}`)] });

  // Validate player has each part in inventory
  for (const [comp, partId] of Object.entries(selectedParts)) {
    const invIdx = player.inventory.findIndex(i => i.partId === partId);
    if (invIdx === -1) {
      return interaction.editReply({ embeds: [errEmbed(`You don't own a ${comp.toUpperCase()} (${PARTS[partId]?.name}). Please restart the build.`)], components: [backRow(`pc_slot_${slot}`)] });
    }
    // Remove from inventory
    player.inventory.splice(invIdx, 1);
    pc.parts[comp] = partId;
  }

  pc.built = true;
  pc.task = 'idle';
  pc.lastCollected = new Date();
  pc.online = true;
  pc.wear = { cpu: 0, gpu: 0, ram: 0, storage: 0, psu: 0, cooling: 0 };

  const { leveled, newLevel } = addXp(player, XP_REWARDS.buildPc);
  await player.save();

  const embed = successEmbed('PC Built!',
    `🎉 **${pc.name || `PC Slot ${slot}`}** is now built and running!\n` +
    `+${XP_REWARDS.buildPc} XP${leveled ? ` 🎉 Level **${newLevel}**!` : ''}\n` +
    `Assign a task from the Tasks menu to start earning.`
  );
  return interaction.editReply({ embeds: [embed], components: [backRow(`pc_slot_${slot}`)] });
}

// ── Upgrade (swap a part) ─────────────────────────────────────────
async function handleUpgradeMenu(interaction, player, slot) {
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [backRow('menu_pcs')] });

  const embed = new EmbedBuilder()
    .setTitle(`🔧 Upgrade — Slot ${slot}`)
    .setDescription('Which component do you want to replace?')
    .setColor(0x3498db);

  const equippedSlots = Object.entries(pc.parts).filter(([, v]) => v);
  if (equippedSlots.length === 0) return interaction.editReply({ embeds: [errEmbed('No parts installed.')], components: [backRow(`pc_slot_${slot}`)] });

  const options = equippedSlots.map(([k, v]) => {
    const p = PARTS[v];
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${k.toUpperCase()}: ${p?.name || '?'}`)
      .setValue(`upgrade_slot_${slot}_${k}`)
      .setEmoji(tierEmoji(p?.tier));
  });

  const select = new StringSelectMenuBuilder()
    .setCustomId(`upgrade_component_select`)
    .setPlaceholder('Pick a component to replace...')
    .addOptions(options);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(select),
      backRow(`pc_slot_${slot}`)
    ]
  });
}

// ── Sell part ─────────────────────────────────────────────────────
async function handleSellPart(interaction, player, idx) {
  const item = player.inventory[idx];
  if (!item) return interaction.editReply({ embeds: [errEmbed('Item not found.')], components: [backRow('menu_inventory')] });
  const part = PARTS[item.partId];
  if (!part) return interaction.editReply({ embeds: [errEmbed('Part data not found.')], components: [backRow('menu_inventory')] });

  player.inventory.splice(idx, 1);
  player.wallet += part.sellPrice;
  await player.save();

  return interaction.editReply({
    embeds: [successEmbed('Part Sold!', `Sold **${part.name}** for **${formatMoney(part.sellPrice)}**!\nWallet: ${formatMoney(player.wallet)}`)],
    components: [backRow('menu_inventory_all_0')]
  });
}

// ── Equip part to PC ──────────────────────────────────────────────
async function handleEquipMenu(interaction, player, invIdx) {
  const builtPcs = player.pcs.filter(p => p.built);
  if (builtPcs.length === 0) {
    return interaction.editReply({ embeds: [errEmbed('No built PCs. Build one first!')], components: [backRow(`inv_item_${invIdx}`)] });
  }

  const item = player.inventory[invIdx];
  const part = PARTS[item?.partId];
  if (!part) return interaction.editReply({ embeds: [errEmbed('Part not found.')], components: [] });

  const options = builtPcs.map(pc =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`Slot ${pc.slot}: ${pc.name}`)
      .setValue(`equip_${invIdx}_to_${pc.slot}`)
      .setEmoji(statusEmoji(pc))
  );

  const embed = new EmbedBuilder()
    .setTitle(`🏷️ Equip ${part.name}`)
    .setDescription('Select which PC to equip this to.')
    .setColor(0x3498db);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`inv_equip_pc_select`)
          .setPlaceholder('Pick a PC...')
          .addOptions(options)
      ),
      backRow(`inv_item_${invIdx}`)
    ]
  });
}

async function handleEquipToPc(interaction, player, customId) {
  const val = interaction.values[0]; // equip_<invIdx>_to_<slot>
  const match = val.match(/^equip_(\d+)_to_(\d+)$/);
  if (!match) return interaction.editReply({ embeds: [errEmbed('Invalid selection.')], components: [] });

  const invIdx = parseInt(match[1]);
  const slot = parseInt(match[2]);

  const item = player.inventory[invIdx];
  const part = PARTS[item?.partId];
  const pc = player.pcs.find(p => p.slot === slot);

  if (!item || !part || !pc) return interaction.editReply({ embeds: [errEmbed('Invalid equip target.')], components: [] });

  // Return old part to inventory if exists
  const oldPartId = pc.parts[part.category];
  if (oldPartId) {
    player.inventory.push({ partId: oldPartId, wear: pc.wear[part.category] || 0, acquired: new Date() });
  }

  pc.parts[part.category] = part.id;
  pc.wear[part.category] = item.wear || 0;
  player.inventory.splice(invIdx, 1);
  await player.save();

  return interaction.editReply({
    embeds: [successEmbed('Part Equipped!', `**${part.name}** is now installed in **${pc.name || `Slot ${slot}`}**!${oldPartId ? `\nOld ${part.category} returned to inventory.` : ''}`)],
    components: [backRow(`pc_slot_${slot}`)]
  });
}

// ── Dismantle PC ──────────────────────────────────────────────────
async function handleDismantleConfirm(interaction, player, slot) {
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('No PC in this slot.')], components: [backRow('menu_pcs')] });

  const embed = new EmbedBuilder()
    .setTitle('⚠️ Confirm Dismantle')
    .setDescription(`Are you sure you want to dismantle **${pc.name || `Slot ${slot}`}**?\n\nAll parts will be returned to inventory. Earnings will be lost if not collected.`)
    .setColor(0xff9900);

  return interaction.editReply({
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`pc_dismantle_confirm_${slot}`).setLabel('💥 Yes, Dismantle').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`pc_slot_${slot}`).setLabel('← Cancel').setStyle(ButtonStyle.Secondary)
    )]
  });
}

async function handleDismantle(interaction, player, slot) {
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('No PC in this slot.')], components: [backRow('menu_pcs')] });

  for (const [comp, partId] of Object.entries(pc.parts)) {
    if (partId) {
      player.inventory.push({ partId, wear: pc.wear[comp] || 0, acquired: new Date() });
    }
  }

  pc.built = false;
  pc.parts = {};
  pc.task = 'idle';
  pc.wear = { cpu: 0, gpu: 0, ram: 0, storage: 0, psu: 0, cooling: 0 };
  pc.online = true;
  pc.offlineUntil = null;
  pc.activeBoost = null;

  await player.save();

  return interaction.editReply({
    embeds: [successEmbed('PC Dismantled', `All parts returned to inventory.`)],
    components: [backRow('menu_pcs')]
  });
}

// ── Rename PC ─────────────────────────────────────────────────────
async function handleRenamePrompt(interaction, player, slot) {
  const embed = new EmbedBuilder()
    .setTitle(`✏️ Rename PC Slot ${slot}`)
    .setDescription('React with a name by clicking a preset or type one below.\n*(Due to Discord limitations, type `!rename <slot> <name>` in chat to set a custom name.)*')
    .setColor(0x3498db);

  const presets = ['Gaming Beast', 'Mining Rig', 'Budget King', 'Server Farm', 'Overclocked'];
  const options = presets.map(name =>
    new ButtonBuilder()
      .setCustomId(`pc_rename_set_${slot}_${name.replace(/ /g, '_')}`)
      .setLabel(name)
      .setStyle(ButtonStyle.Primary)
  );

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(...options.slice(0, 4)),
      backRow(`pc_slot_${slot}`)
    ]
  });
}

async function handleRenameSet(interaction, player, slot, rawName) {
  const name = rawName.replace(/_/g, ' ');
  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [] });
  pc.name = name;
  await player.save();
  return interaction.editReply({
    embeds: [successEmbed('PC Renamed!', `Slot ${slot} is now named **${name}**.`)],
    components: [backRow(`pc_slot_${slot}`)]
  });
}

// ── Task assign ───────────────────────────────────────────────────
async function handleTaskAssignMenu(interaction, player, pc) {
  const { getAvailableTasks } = await import('../game/tasks.js');
  const available = getAvailableTasks(player, pc, PARTS);

  if (available.length === 0) {
    return interaction.editReply({ embeds: [errEmbed('No tasks available for this PC. You may need better parts or a higher level.')], components: [backRow('menu_tasks')] });
  }

  const options = available.slice(0, 25).map(t =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`${t.name} — ${formatMoney(t.baseEarningsPerHour)}/hr`)
      .setValue(`assign_${pc.slot}_${t.id}`)
      .setDescription(`Risk: ${'⚠️'.repeat(t.riskLevel) || 'None'} | Lvl ${t.levelRequired}+`)
      .setEmoji(t.emoji)
  );

  const embed = new EmbedBuilder()
    .setTitle(`📋 Assign Task — ${pc.name || `Slot ${pc.slot}`}`)
    .setDescription('Select a task to run on this PC.')
    .setColor(0xe74c3c);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('tasks_assign_select')
          .setPlaceholder('Pick a task...')
          .addOptions(options)
      ),
      backRow('menu_tasks')
    ]
  });
}

async function handleTaskAssign(interaction, player) {
  const val = interaction.values[0]; // assign_<slot>_<taskId>
  const rest = val.replace('assign_', '');
  const underscoreIdx = rest.indexOf('_');
  const slot = parseInt(rest.substring(0, underscoreIdx));
  const taskId = rest.substring(underscoreIdx + 1);

  const pc = player.pcs.find(p => p.slot === slot);
  const task = TASKS[taskId];
  if (!pc || !task) return interaction.editReply({ embeds: [errEmbed('Invalid task or PC.')], components: [] });

  pc.task = taskId;
  pc.taskStarted = new Date();
  pc.lastCollected = new Date();
  pc.online = true;
  await player.save();

  return interaction.editReply({
    embeds: [successEmbed('Task Assigned!', `**${pc.name || `Slot ${slot}`}** is now running ${task.emoji} **${task.name}**!\nEarnings will accumulate until you collect.`)],
    components: [backRow(`pc_slot_${slot}`)]
  });
}

// ── Bank ──────────────────────────────────────────────────────────
async function handleBankMenu(interaction, player) {
  const embed = new EmbedBuilder()
    .setTitle('🏦 Bank')
    .setDescription(
      `💰 Wallet: **${formatMoney(player.wallet)}**\n` +
      `🏦 Bank: **${formatMoney(player.bank)}**\n\n` +
      `Your bank balance is safe from events and raids.`
    )
    .setColor(0xf39c12);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('bank_deposit_all').setLabel('⬇️ Deposit All').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('bank_deposit_half').setLabel('⬇️ Deposit Half').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('bank_withdraw_all').setLabel('⬆️ Withdraw All').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('bank_withdraw_half').setLabel('⬆️ Withdraw Half').setStyle(ButtonStyle.Secondary)
      ),
      backRow('menu_profile')
    ]
  });
}

async function handleBankDeposit(interaction, player, amount) {
  if (player.wallet <= 0) return interaction.editReply({ embeds: [errEmbed('Nothing to deposit.')], components: [backRow('profile_bank')] });
  const depositAmt = amount === 'all' ? player.wallet : Math.floor(player.wallet / 2);
  player.bank += depositAmt;
  player.wallet -= depositAmt;
  await player.save();
  return interaction.editReply({ embeds: [successEmbed('Deposited!', `${formatMoney(depositAmt)} deposited. Bank: ${formatMoney(player.bank)}`)], components: [backRow('profile_bank')] });
}

async function handleBankWithdraw(interaction, player, amount) {
  if (player.bank <= 0) return interaction.editReply({ embeds: [errEmbed('Bank is empty.')], components: [backRow('profile_bank')] });
  const withdrawAmt = amount === 'all' ? player.bank : Math.floor(player.bank / 2);
  player.wallet += withdrawAmt;
  player.bank -= withdrawAmt;
  await player.save();
  return interaction.editReply({ embeds: [successEmbed('Withdrawn!', `${formatMoney(withdrawAmt)} withdrawn. Wallet: ${formatMoney(player.wallet)}`)], components: [backRow('profile_bank')] });
}

// ── Prestige ──────────────────────────────────────────────────────
async function handlePrestige(interaction, player) {
  if (player.level < 20) return interaction.editReply({ embeds: [errEmbed('Requires Level 20+.')], components: [backRow('menu_profile')] });
  const hasExotic = player.inventory.some(i => {
    const p = PARTS[i.partId];
    return p && ['exotic', 'legendary', 'mythic'].includes(p.tier);
  });
  if (!hasExotic) return interaction.editReply({ embeds: [errEmbed('Requires owning an Exotic+ part.')], components: [backRow('menu_profile')] });

  player.prestige += 1;
  player.xp = 0;
  player.level = 1;
  player.wallet = 500;
  player.inventory = [];
  for (const pc of player.pcs) {
    pc.built = false;
    pc.parts = {};
    pc.task = 'idle';
    pc.wear = { cpu: 0, gpu: 0, ram: 0, storage: 0, psu: 0, cooling: 0 };
    pc.online = true;
    pc.offlineUntil = null;
  }
  await player.save();

  return interaction.editReply({
    embeds: [successEmbed(`🌟 Prestige ${player.prestige}!`, `You have ascended! Your grind resets, but your legacy remains.\n+10% permanent earnings bonus per prestige level.\nWallet reset to $500. Bank and karma preserved.`)],
    components: [backRow('menu_main')]
  });
}

// ── Leaderboard ───────────────────────────────────────────────────
async function handleLeaderboard(interaction, player, type) {
  let data = [];
  try {
    if (type === 'richest' || type === 'best_rig') {
      const players = await Player.find({}).sort({ wallet: -1 }).limit(10);
      if (type === 'richest') {
        data = players.map(p => ({ username: p.username || 'Unknown', valueDisplay: formatMoney(p.wallet + p.bank) }));
      } else {
        // best rig: highest combined score across all PCs
        data = players.map(p => {
          let best = 0;
          for (const pc of p.pcs) {
            if (!pc.built) continue;
            const cpu = PARTS[pc.parts.cpu];
            const gpu = PARTS[pc.parts.gpu];
            const ram = PARTS[pc.parts.ram];
            if (cpu && gpu && ram) {
              const score = Math.round((cpu.score * 0.35 + gpu.score * 0.45 + ram.score * 0.20) * 1000);
              if (score > best) best = score;
            }
          }
          return { username: p.username || 'Unknown', valueDisplay: `Score: ${best.toLocaleString()}`, _score: best };
        }).sort((a, b) => b._score - a._score);
      }
    } else if (type === 'top_miners') {
      const players = await Player.find({}).sort({ totalLifetimeEarned: -1 }).limit(10);
      data = players.map(p => ({ username: p.username || 'Unknown', valueDisplay: formatMoney(p.totalLifetimeEarned || 0) + ' lifetime' }));
    } else if (type === 'prestige') {
      const players = await Player.find({}).sort({ prestige: -1 }).limit(10);
      data = players.map(p => ({ username: p.username || 'Unknown', valueDisplay: `Prestige ${p.prestige} | Lvl ${p.level}` }));
    }
  } catch (err) {
    console.error('Leaderboard error:', err);
  }

  return interaction.editReply(renderLeaderboard(data, type));
}

// ── Events log menu ───────────────────────────────────────────────
async function handleEventsMenu(interaction, player) {
  const { events } = await import('../game/events.js');
  const embed = new EmbedBuilder()
    .setTitle('🎲 Random Events')
    .setDescription('These events can trigger when collecting or hourly:')
    .setColor(0xe74c3c);

  const lines = events.map(e => `${e.name} — *${e.description}*`).join('\n');
  embed.addFields({ name: 'Active Events', value: lines.substring(0, 1024) });

  return interaction.editReply({
    embeds: [embed],
    components: [backRow('menu_main')]
  });
}

// ── Upgrade: pick which inventory part to swap in ─────────────────
async function handleUpgradeComponentSelect(interaction, player) {
  const val = interaction.values[0]; // upgrade_slot_<slot>_<component>
  const match = val.match(/^upgrade_slot_(\d+)_(\w+)$/);
  if (!match) return interaction.editReply({ embeds: [errEmbed('Invalid selection.')], components: [] });

  const slot = parseInt(match[1]);
  const component = match[2];

  const owned = player.inventory.filter(i => {
    const p = PARTS[i.partId];
    return p && p.category === component;
  });

  if (owned.length === 0) {
    return interaction.editReply({
      embeds: [errEmbed(`You don't have any ${component.toUpperCase()} parts in your inventory to swap in.`)],
      components: [backRow(`pc_slot_${slot}`)]
    });
  }

  const options = owned.slice(0, 25).map((item, i) => {
    const p = PARTS[item.partId];
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${p.name} — Score: ${p.score}`)
      .setValue(`swappart_${slot}_${component}_${i}`)
      .setDescription(`${p.tier} | ${wearBar(item.wear || 0).substring(0, 50)}`)
      .setEmoji(tierEmoji(p.tier));
  });

  const embed = new EmbedBuilder()
    .setTitle(`🔧 Upgrade ${component.toUpperCase()} — Slot ${slot}`)
    .setDescription('Pick the part from your inventory to install.')
    .setColor(0x3498db);

  return interaction.editReply({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`upgrade_confirm_${slot}_${component}`)
          .setPlaceholder('Pick a replacement...')
          .addOptions(options)
      ),
      backRow(`pc_upgrade_${slot}`)
    ]
  });
}

// ── Upgrade: execute the swap ─────────────────────────────────────
async function handleUpgradePartSelect(interaction, player) {
  const val = interaction.values[0]; // swappart_<slot>_<component>_<invIdx>
  const match = val.match(/^swappart_(\d+)_(\w+)_(\d+)$/);
  if (!match) return interaction.editReply({ embeds: [errEmbed('Invalid selection.')], components: [] });

  const slot = parseInt(match[1]);
  const component = match[2];
  const relativeIdx = parseInt(match[3]);

  const pc = player.pcs.find(p => p.slot === slot);
  if (!pc || !pc.built) return interaction.editReply({ embeds: [errEmbed('PC not found.')], components: [] });

  // Find the nth matching inventory item
  const owned = player.inventory.filter(i => {
    const p = PARTS[i.partId];
    return p && p.category === component;
  });
  const chosenItem = owned[relativeIdx];
  if (!chosenItem) return interaction.editReply({ embeds: [errEmbed('Part not found in inventory.')], components: [] });

  const invIdx = player.inventory.indexOf(chosenItem);
  const newPart = PARTS[chosenItem.partId];

  // Return old part to inventory if one is equipped
  const oldPartId = pc.parts[component];
  if (oldPartId) {
    player.inventory.push({ partId: oldPartId, wear: pc.wear[component] || 0, acquired: new Date() });
  }

  // Install new part
  pc.parts[component] = newPart.id;
  pc.wear[component] = chosenItem.wear || 0;
  player.inventory.splice(invIdx, 1);

  await player.save();

  return interaction.editReply({
    embeds: [successEmbed('Part Upgraded!',
      `**${component.toUpperCase()}** swapped to **${newPart.name}**!` +
      (oldPartId ? `\nOld part returned to inventory.` : '')
    )],
    components: [backRow(`pc_slot_${slot}`)]
  });
}
