// handlers/menuHandler.js — Renders all menus as embeds + component rows
import {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder,
  ButtonStyle, StringSelectMenuOptionBuilder
} from 'discord.js';
import { parts as PARTS, CATEGORIES, getPartsByCategory } from '../game/parts.js';
import { tasks as TASKS, getAvailableTasks } from '../game/tasks.js';
import { marketEvents, TIER_COLORS, STATUS_COLORS, XP_THRESHOLDS, getPrestigeLevelRequirement } from '../game/config.js';
import { formatMoney, wearBar, tierEmoji, statusEmoji, xpBar, shortNum, tierLabel } from '../utils/format.js';
import { calculateEarnings, calculateEarningsPerHour, calculateRepairCost, getBottleneckReport } from './economyHandler.js';

function footer(player) {
  return { text: `PCForge v1.0 • Your wallet: ${formatMoney(player?.wallet ?? 0)}` };
}
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function scoreLabel(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function discordTime(date, style = 'R') {
  const timestamp = Math.floor(new Date(date).getTime() / 1000);
  return `<t:${timestamp}:${style}>`;
}

function pcStatusText(pc, task) {
  const offlineUntil = pc.offlineUntil ? new Date(pc.offlineUntil) : null;
  const hasTemporaryDowntime = offlineUntil && Date.now() < offlineUntil.getTime();

  if (!pc.online && hasTemporaryDowntime) {
    return `Offline - disabled and event downtime ends ${discordTime(offlineUntil)}`;
  }
  if (!pc.online) {
    return 'Offline - stored offline flag is false; assigning a task brings it back online';
  }
  if (hasTemporaryDowntime) {
    return `Offline - random event downtime ends ${discordTime(offlineUntil)}`;
  }
  return task ? `${task.emoji} ${task.name}` : 'Idle';
}

function bottleneckLines(pc, report) {
  const lines = [];
  const strongest = report.strongest;

  if (report.severity === 'incomplete') {
    const missing = report.bottlenecks.map(item => item.key.toUpperCase()).join(', ');
    lines.push(`Missing required core component(s): ${missing}. Earnings are blocked.`);
  } else {
    for (const item of report.bottlenecks) {
      const pct = Math.round(item.ratioToStrongest * 100);
      lines.push(`${item.label} ${item.key.toUpperCase()} bottleneck: ${scoreLabel(item.score)} score is ${pct}% of ${strongest.label} (${scoreLabel(strongest.score)}).`);
    }
    if (report.penaltyPercent > 0) {
      lines.push(`Core balance punishment: -${report.penaltyPercent}% earnings (${report.multiplier.toFixed(1)}x multiplier).`);
    }
  }

  const cpu = PARTS[pc.parts?.cpu];
  const gpu = PARTS[pc.parts?.gpu];
  const psu = PARTS[pc.parts?.psu];
  const cooling = PARTS[pc.parts?.cooling];
  if (cpu && gpu) {
    const totalTdp = (cpu.wattage || 0) + (gpu.wattage || 0);
    if (!psu) {
      lines.push(`Power bottleneck: no PSU installed for ${totalTdp}W CPU+GPU draw. Earnings punishment: -50%.`);
    } else if (psu.wattage < totalTdp) {
      lines.push(`Power bottleneck: ${psu.name} is ${psu.wattage}W, below ${totalTdp}W CPU+GPU draw. Earnings punishment: -50%.`);
    }
  }

  if (cpu && cooling && ['exotic', 'legendary', 'mythic'].includes(cpu.tier) && ['stock_cooler', 'cooler_budget_tower'].includes(cooling.id)) {
    lines.push(`Thermal bottleneck: ${cooling.name} is too weak for ${cpu.name}. Wear climbs faster without better cooling.`);
  }

  if (lines.length === 0) lines.push('No bottlenecks detected.');
  return lines;
}

// ──────────────────────────── MAIN MENU ────────────────────────────
export function renderMainMenu(player) {
  const embed = new EmbedBuilder()
    .setTitle('⚡ PCForge — Main Menu')
    .setDescription(
      `Welcome back, **${player.username || 'Builder'}**!\n` +
      `💰 Wallet: **${formatMoney(player.wallet)}** | 🏦 Bank: **${formatMoney(player.bank)}**\n` +
      `⭐ Level **${player.level}** | 🏆 Prestige **${player.prestige}** | 🌟 Karma **${player.karmaPoints}**`
    )
    .setColor(0x5865F2)
    .setFooter(footer(player))
    .setTimestamp();

  const row1 = new ActionRowBuilder().addComponents(
    btn('menu_pcs', '🖥️ My PCs', ButtonStyle.Primary),
    btn('menu_inventory', '🎒 Inventory', ButtonStyle.Primary),
    btn('menu_shop', '🛒 Shop', ButtonStyle.Success),
    btn('menu_profile', '📊 Profile', ButtonStyle.Secondary)
  );
  const row2 = new ActionRowBuilder().addComponents(
    btn('menu_tasks', '📋 Tasks', ButtonStyle.Secondary),
    btn('menu_market', '📈 Market', ButtonStyle.Secondary),
    btn('menu_events', '🎲 Events', ButtonStyle.Secondary),
    btn('menu_leaderboard', '🏆 Leaderboard', ButtonStyle.Secondary)
  );
  const row3 = new ActionRowBuilder().addComponents(
    btn('menu_scavenge', '🔍 Scavenge', ButtonStyle.Danger)
  );

  return { embeds: [embed], components: [row1, row2, row3] };
}

// ──────────────────────────── SHOP ────────────────────────────
export function renderShopCategories(player) {
  const embed = new EmbedBuilder()
    .setTitle('🛒 Shop — Select Category')
    .setDescription('Choose a component category to browse.')
    .setColor(0x2ecc71)
    .setFooter(footer(player));

  const options = CATEGORIES.map(cat => ({
    label: cap(cat),
    value: `shop_cat_${cat}`,
    emoji: catEmoji(cat)
  }));

  const select = new StringSelectMenuBuilder()
    .setCustomId('shop_category_select')
    .setPlaceholder('Pick a category...')
    .addOptions(options.map(o =>
      new StringSelectMenuOptionBuilder().setLabel(o.label).setValue(o.value).setEmoji(o.emoji)
    ));

  const backRow = new ActionRowBuilder().addComponents(btn('menu_main', '← Back', ButtonStyle.Secondary));
  const selectRow = new ActionRowBuilder().addComponents(select);

  return { embeds: [embed], components: [selectRow, backRow] };
}

export function renderShopCategory(player, category, page = 0) {
  const allParts = getPartsByCategory(category);
  
  if (allParts.length === 0) {
    const embed = new EmbedBuilder()
      .setTitle(`🛒 Shop — ${cap(category)}`)
      .setDescription('No parts available in this category yet, or your level is too low.')
      .setColor(0x2ecc71)
      .setFooter(footer(player));
    return {
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn('shop_cat_back', '← Categories', ButtonStyle.Secondary))]
    };
  }
  const PAGE_SIZE = 25;
  const pageCount = Math.ceil(allParts.length / PAGE_SIZE);
  const pageParts = allParts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const embed = new EmbedBuilder()
    .setTitle(`🛒 Shop — ${cap(category)} (Page ${page + 1}/${pageCount})`)
    .setDescription(`Level ${player.level} unlocked — showing ${pageParts.length} parts.`)
    .setColor(0x2ecc71)
    .setFooter(footer(player));

  const options = pageParts.map(p =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`${p.name} — ${formatMoney(p.price)}`)
      .setValue(`shopbuy_${p.id}`)
      .setDescription(`${cap(p.tier)} | Score: ${p.score}`)
      .setEmoji(tierEmoji(p.tier))
  );

  const select = new StringSelectMenuBuilder()
    .setCustomId(`shop_item_select_${category}_${page}`)
    .setPlaceholder('Select a part to view...')
    .addOptions(options);

  const navButtons = [btn(`shop_cat_back`, '← Categories', ButtonStyle.Secondary)];
  if (page > 0) navButtons.push(btn(`shop_page_${category}_${page - 1}`, '◀ Prev', ButtonStyle.Primary));
  if (page < pageCount - 1) navButtons.push(btn(`shop_page_${category}_${page + 1}`, '▶ Next', ButtonStyle.Primary));

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(select), new ActionRowBuilder().addComponents(...navButtons)]
  };
}

export function renderPartDetail(player, part, context = 'shop') {
  const canAfford = player.wallet >= part.price;
  const owned = player.inventory.filter(i => i.partId === part.id).length;

  const embed = new EmbedBuilder()
    .setTitle(`${tierEmoji(part.tier)} ${part.name}`)
    .setDescription(
      (part.flavor ? `*${part.flavor}*\n\n` : '') +
      (part.lore ? `${part.lore}\n\n` : '')
    )
    .setColor(TIER_COLORS[part.tier] || 0x808080)
    .addFields(
      { name: '💰 Price', value: formatMoney(part.price), inline: true },
      { name: '💸 Sell Price', value: formatMoney(part.sellPrice), inline: true },
      { name: '⭐ Tier', value: cap(part.tier), inline: true },
      { name: '📊 Score', value: String(part.score), inline: true },
      { name: '🔋 Wattage', value: `${part.wattage}W`, inline: true },
      { name: '📦 You Own', value: String(owned), inline: true }
    )
    .setFooter(footer(player));

  if (part.specs) {
    const specLines = Object.entries(part.specs).map(([k, v]) => `**${cap(k)}:** ${v}`).join('\n');
    embed.addFields({ name: '📋 Specs', value: specLines.substring(0, 1024) });
  }

  const buyBtn = new ButtonBuilder()
    .setCustomId(`shop_confirm_buy_${part.id}`)
    .setLabel(canAfford ? '💰 Buy' : '❌ Can\'t Afford')
    .setStyle(canAfford ? ButtonStyle.Success : ButtonStyle.Danger)
    .setDisabled(!canAfford);

  const backBtn = btn(`shop_cat_${part.category}_0`, '← Back', ButtonStyle.Secondary);
  return { embeds: [embed], components: [new ActionRowBuilder().addComponents(buyBtn, backBtn)] };
}

// ──────────────────────────── MY PCS ────────────────────────────
export function renderPcList(player) {
  const embed = new EmbedBuilder()
    .setTitle('🖥️ My PCs')
    .setDescription('Manage your PC slots below.')
    .setColor(0x3498db)
    .setFooter(footer(player));

  const slots = [1, 2, 3, 4].map(slot => {
    const pc = player.pcs.find(p => p.slot === slot);
    return pc || { slot, built: false };
  });

  const buttons = slots.map(pc =>
    new ButtonBuilder()
      .setCustomId(`pc_slot_${pc.slot}`)
      .setLabel(`${statusEmoji(pc)} ${pc.name || `Slot ${pc.slot}`}`)
      .setStyle(ButtonStyle.Primary)
  );

  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(...buttons),
      new ActionRowBuilder().addComponents(
        btn('pc_collect_all', '💵 Collect All', ButtonStyle.Success),
        btn('menu_main', '← Back', ButtonStyle.Secondary)
      )
    ]
  };
}

export function renderPcDetail(player, pc, marketState) {
  const embed = new EmbedBuilder()
    .setTitle(`🖥️ ${pc.name || `PC Slot ${pc.slot}`}`)
    .setFooter(footer(player))
    .setTimestamp();

  if (!pc.built) {
    embed.setDescription('⚪ This slot is empty. Build a PC to get started!')
      .setColor(0x808080);
    return {
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(
        btn(`pc_build_${pc.slot}`, '🔨 Build PC', ButtonStyle.Success),
        btn('menu_pcs', '← Back', ButtonStyle.Secondary)
      )]
    };
  }

  const isOffline = !pc.online || (pc.offlineUntil && new Date() < new Date(pc.offlineUntil));
  embed.setColor(isOffline ? STATUS_COLORS.offline : STATUS_COLORS.online);

  const task = pc.task && pc.task !== 'idle' ? TASKS[pc.task] : null;
  const pendingEarnings = calculateEarnings(pc, player, marketState);

  const partFields = [];
  for (const [slot, partId] of Object.entries(pc.parts)) {
    if (!partId) continue;
    const part = PARTS[partId];
    if (!part) continue;
    const wearVal = pc.wear[slot] ?? 0;
    partFields.push({
      name: `${tierEmoji(part.tier)} ${cap(slot)}: ${part.name}`,
      value: wearBar(wearVal),
      inline: true
    });
  }

  const bottleneckReport = getBottleneckReport(pc);
  const bottlenecks = bottleneckLines(pc, bottleneckReport);
  const earningsPerHour = task ? calculateEarningsPerHour(pc, player, marketState) : 0;
  const repairCost = calculateRepairCost(pc);
  
  embed.setDescription(
    `**Status:** ${statusEmoji(pc)} ${pcStatusText(pc, task)}\n` +
    `**Pending Earnings:** +${formatMoney(pendingEarnings)} 💰\n` +
    (task ? `**Earning:** ${formatMoney(earningsPerHour)}/hr\n` : '') +
    `**Repair All:** ${repairCost > 0 ? formatMoney(repairCost) : 'No repairs needed'}\n` +
    `**Bottleneck Penalty:** ${bottleneckReport.penaltyPercent > 0 ? `-${bottleneckReport.penaltyPercent}% earnings` : 'None'}\n` +
    `**Total Earned:** ${formatMoney(pc.totalEarned)}`
  );

  embed.addFields({
    name: 'Bottlenecks',
    value: bottlenecks.map(line => `- ${line}`).join('\n').substring(0, 1024),
    inline: false
  });

  if (partFields.length) embed.addFields(partFields);

  const actionRow = new ActionRowBuilder().addComponents(
    btn(`pc_assign_task_${pc.slot}`, '⚙️ Assign Task', ButtonStyle.Primary),
    btn(`pc_collect_${pc.slot}`, '💵 Collect', ButtonStyle.Success),
    btn(`pc_upgrade_${pc.slot}`, '🔧 Upgrade', ButtonStyle.Secondary),
    btn(`pc_dismantle_${pc.slot}`, '🔨 Dismantle', ButtonStyle.Danger),
    btn(`pc_rename_${pc.slot}`, '✏️ Rename', ButtonStyle.Secondary)
  );
  const backRow = new ActionRowBuilder().addComponents(btn('menu_pcs', '← Back', ButtonStyle.Secondary));

  const repairRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`pc_repair_all_${pc.slot}`)
      .setLabel(repairCost > 0 ? `Repair All (${formatMoney(repairCost)})` : 'Repair All')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(repairCost <= 0)
  );

  return { embeds: [embed], components: [actionRow, repairRow, backRow] };
}

// ──────────────────────────── INVENTORY ────────────────────────────
export function renderInventory(player, filterCat = 'all', page = 0) {
  let items = player.inventory;
  if (filterCat !== 'all') items = items.filter(i => PARTS[i.partId]?.category === filterCat);

  const PAGE_SIZE = 10;
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const embed = new EmbedBuilder()
    .setTitle(`🎒 Inventory (${items.length} parts)`)
    .setColor(0x9b59b6)
    .setFooter(footer(player));

  if (pageItems.length === 0) {
    embed.setDescription('No parts found. Buy some in the Shop!');
  } else {
    pageItems.forEach((item, idx) => {
      const part = PARTS[item.partId];
      if (!part) return;
      embed.addFields({
        name: `${idx + 1 + page * PAGE_SIZE}. ${tierEmoji(part.tier)} ${part.name}`,
        value: `Wear: ${wearBar(item.wear || 0)} | Acquired: <t:${Math.floor(new Date(item.acquired || Date.now()).getTime() / 1000)}:R>`,
        inline: false
      });
    });
  }

  const catButtons = ['all', ...CATEGORIES].map(cat =>
    new ButtonBuilder()
      .setCustomId(`inv_filter_${cat}_0`)
      .setLabel(cat === 'all' ? '📦 All' : cap(cat))
      .setStyle(filterCat === cat ? ButtonStyle.Primary : ButtonStyle.Secondary)
  );

  // After building pageItems embed fields, add item buttons before pagination
  const rows = [];
  for (let i = 0; i < catButtons.length; i += 5) {
    rows.push(new ActionRowBuilder().addComponents(...catButtons.slice(i, i + 5)));
  }
  
  // Item buttons — up to 5 per row, max 2 rows (10 items matches PAGE_SIZE)
  const itemBtns = pageItems.map((item, idx) => {
    const part = PARTS[item.partId];
    const globalIdx = idx + page * PAGE_SIZE;
    return new ButtonBuilder()
      .setCustomId(`inv_item_${globalIdx}`)
      .setLabel(`${globalIdx + 1}. ${part?.name?.substring(0, 20) || '?'}`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(tierEmoji(part?.tier));
  });
  for (let i = 0; i < itemBtns.length; i += 5) {
    rows.push(new ActionRowBuilder().addComponents(...itemBtns.slice(i, i + 5)));
  }
  
  // Pagination + back
  const navBtns = [btn('menu_main', '← Back', ButtonStyle.Secondary)];
  if (page > 0) navBtns.unshift(btn(`inv_filter_${filterCat}_${page - 1}`, '◀ Prev', ButtonStyle.Primary));
  if (page < pageCount - 1) navBtns.push(btn(`inv_filter_${filterCat}_${page + 1}`, '▶ Next', ButtonStyle.Primary));
  rows.push(new ActionRowBuilder().addComponents(...navBtns));
  
  return { embeds: [embed], components: rows.slice(0, 5) };
}

export function renderInventoryItemAction(player, inventoryIndex) {
  const item = player.inventory[inventoryIndex];
  if (!item) return renderInventory(player);
  const part = PARTS[item.partId];
  if (!part) return renderInventory(player);

  const embed = new EmbedBuilder()
    .setTitle(`${tierEmoji(part.tier)} ${part.name}`)
    .setDescription(
      `**Wear:** ${wearBar(item.wear || 0)}\n` +
      `**Acquired:** <t:${Math.floor(new Date(item.acquired || Date.now()).getTime() / 1000)}:R>\n` +
      `**Sell Value:** ${formatMoney(part.sellPrice)}\n\n` +
      `*${part.flavor}*`
    )
    .setColor(TIER_COLORS[part.tier] || 0x808080)
    .setFooter(footer(player));

  const rows = [
    new ActionRowBuilder().addComponents(
      btn(`inv_equip_${inventoryIndex}`, '🏷️ Equip to PC', ButtonStyle.Primary),
      btn(`inv_sell_${inventoryIndex}`, `💸 Sell (${formatMoney(part.sellPrice)})`, ButtonStyle.Danger),
      btn(`menu_inventory_all_0`, '← Back', ButtonStyle.Secondary)
    )
  ];

  return { embeds: [embed], components: rows };
}

// ──────────────────────────── PROFILE ────────────────────────────
export function renderProfile(player) {
  const nextXp = XP_THRESHOLDS[player.level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const prestigeLevelRequired = getPrestigeLevelRequirement(player.prestige);
  const embed = new EmbedBuilder()
    .setTitle('📊 Profile')
    .setColor(0x5865F2)
    .setDescription(
      `**${player.username || 'Builder'}**\n` +
      `Level: **${player.level}** | XP: **${shortNum(player.xp)}** / **${shortNum(nextXp)}**\n` +
      xpBar(player.xp, nextXp)
    )
    .addFields(
      { name: '💰 Wallet', value: formatMoney(player.wallet), inline: true },
      { name: '🏦 Bank', value: formatMoney(player.bank), inline: true },
      { name: '🌟 Karma', value: String(player.karmaPoints), inline: true },
      { name: '🏆 Prestige', value: String(player.prestige), inline: true },
      { name: 'Next Prestige', value: `Level ${prestigeLevelRequired}`, inline: true },
      { name: '📈 Lifetime Earned', value: formatMoney(player.totalLifetimeEarned), inline: true },
      { name: '🎒 Parts Owned', value: String(player.inventory.length), inline: true }
    )
    .setFooter(footer(player))
    .setTimestamp();

  const canPrestige = player.level >= prestigeLevelRequired;

  const rows = [
    new ActionRowBuilder().addComponents(
      btn('profile_bank', '🏦 Bank', ButtonStyle.Primary),
      btn(canPrestige ? 'profile_prestige' : 'profile_prestige_locked', '🌟 Prestige', canPrestige ? ButtonStyle.Success : ButtonStyle.Secondary),
      btn('menu_main', '← Back', ButtonStyle.Secondary)
    )
  ];

  return { embeds: [embed], components: rows };
}

// ──────────────────────────── MARKET ────────────────────────────
export function renderMarket(player, marketState) {
  const event = marketState ? marketEvents.find(e => e.id === marketState.eventId) : null;
  const embed = new EmbedBuilder()
    .setTitle('📈 Market Overview')
    .setColor(0xf39c12)
    .setFooter(footer(player));

  const eventDesc = event
    ? `**Current Event:** ${event.name}\n` +
      (event.affectedTasks ? `Affected tasks: ${event.affectedTasks.join(', ')} (×${event.multiplier})\n` : '') +
      (event.effect ? `Effect: ${event.effect}\n` : '') +
      `Expires: <t:${Math.floor(new Date(marketState.expiresAt).getTime() / 1000)}:R>`
    : '📊 Markets are stable. No active events.';

  embed.setDescription(eventDesc);

  // Live earnings estimate per running PC
  const runningPcs = player.pcs.filter(pc => pc.built && pc.task && pc.task !== 'idle' && pc.online);
  if (runningPcs.length > 0) {
    const earningLines = runningPcs.map(pc => {
      const est = calculateEarnings(pc, player, marketState);
      const task = TASKS[pc.task];
      return `${statusEmoji(pc)} **${pc.name}** — ${task?.emoji || ''} ${task?.name || pc.task}: +${formatMoney(est)} pending`;
    }).join('\n');
    embed.addFields({ name: '💡 Your Running PCs (estimated pending)', value: earningLines });
  }

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(btn('menu_main', '← Back', ButtonStyle.Secondary))]
  };
}

// ──────────────────────────── LEADERBOARD ────────────────────────────
export function renderLeaderboard(data, type) {
  const titles = {
    richest: '💰 Richest Players',
    best_rig: '⚡ Best Rigs',
    top_miners: '⛏️ Top Miners',
    prestige: '🏆 Prestige Rankings'
  };

  const embed = new EmbedBuilder()
    .setTitle(titles[type] || '🏆 Leaderboard')
    .setColor(0xf39c12)
    .setTimestamp();

  if (!data || data.length === 0) {
    embed.setDescription('No data yet. Be the first!');
  } else {
    const medals = ['🥇', '🥈', '🥉'];
    const lines = data.slice(0, 10).map((entry, i) => {
      const medal = medals[i] || `**${i + 1}.**`;
      return `${medal} **${entry.username}** — ${entry.valueDisplay}`;
    });
    embed.setDescription(lines.join('\n'));
  }

  const select = new StringSelectMenuBuilder()
    .setCustomId('leaderboard_type_select')
    .setPlaceholder('Switch leaderboard...')
    .addOptions(
      { label: '💰 Richest', value: 'lb_richest' },
      { label: '⚡ Best Rig', value: 'lb_best_rig' },
      { label: '⛏️ Top Miners', value: 'lb_top_miners' },
      { label: '🏆 Prestige', value: 'lb_prestige' }
    );

  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(select),
      new ActionRowBuilder().addComponents(btn('menu_main', '← Back', ButtonStyle.Secondary))
    ]
  };
}

// ──────────────────────────── TASKS MENU ────────────────────────────
export function renderTasksMenu(player, targetPc = null) {
  const embed = new EmbedBuilder()
    .setTitle('📋 Tasks')
    .setColor(0xe74c3c)
    .setFooter(footer(player));

  const taskList = Object.values(TASKS).map(t =>
    `${t.emoji} **${t.name}** — ${formatMoney(t.baseEarningsPerHour)}/hr base | Risk: ${'⚠️'.repeat(t.riskLevel) || 'None'} | Lvl ${t.levelRequired}+`
  ).join('\n');

  embed.setDescription(taskList.substring(0, 4000));

  if (!targetPc) {
    // Show PC selector
    const builtPcs = player.pcs.filter(p => p.built);
    if (builtPcs.length === 0) {
      embed.addFields({ name: '⚠️ No PCs', value: 'Build a PC first to assign tasks.' });
      return {
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn('menu_main', '← Back', ButtonStyle.Secondary))]
      };
    }

    const options = builtPcs.map(pc =>
      new StringSelectMenuOptionBuilder()
        .setLabel(`Slot ${pc.slot}: ${pc.name}`)
        .setValue(`tasks_assign_pc_${pc.slot}`)
        .setDescription(`Current task: ${pc.task || 'idle'}`)
        .setEmoji(statusEmoji(pc))
    );

    return {
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('tasks_pc_select')
            .setPlaceholder('Select a PC to assign task...')
            .addOptions(options)
        ),
        new ActionRowBuilder().addComponents(btn('menu_main', '← Back', ButtonStyle.Secondary))
      ]
    };
  }

  return { embeds: [embed], components: [] };
}

// ──────────────────────────── HELPERS ────────────────────────────
function btn(customId, label, style) {
  return new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(style);
}

function catEmoji(cat) {
  const map = {
    cpu: '💻', gpu: '🖥️', ram: '🧠', storage: '💾',
    psu: '🔌', motherboard: '🔧', cooling: '❄️', case: '📦'
  };
  return map[cat] || '⚙️';
}
