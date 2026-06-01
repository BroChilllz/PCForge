// game/config.js — Tuning Constants

export const XP_THRESHOLDS = [
  0, 100, 150, 225, 337, 505, 757, 1135, 1702, 2553,
  3829, 5743, 8614, 12921, 19381, 29071, 43606, 65409, 98113, 147169,
  220753, 331129, 496693, 745039, 1117558, 1676337, 2514505, 3771757, 5657635, 8486452,
  12729678, 19094517, 28641775, 42962662, 64443993, 96665989, 144998983, 217498474, 326247711, 489371566
];

export const XP_REWARDS = {
  buyPart: 1.2,
  //buildPc: 50,
  collectEarnings: 1.25,
  completeBenchmark: 20,
  prestige: 0,
  scavenge: 8,
  firstBuild: 100
};

export const PRESTIGE_LEVEL_REQUIREMENTS = [20, 25, 30, 35, 40, 40];

export const PRESTIGE_MONEY_MULTIPLIERS = {
  0: 1,
  1: 1.5,
  2: 2.25,
  3: 3,
  4: 4,
  5: 5.25,
  6: 6.75
};

export function getPrestigeLevelRequirement(currentPrestige = 0) {
  const index = Math.max(0, Math.trunc(currentPrestige));
  return PRESTIGE_LEVEL_REQUIREMENTS[Math.min(index, PRESTIGE_LEVEL_REQUIREMENTS.length - 1)];
}

export function getPrestigeMoneyMultiplier(prestige = 0) {
  const cappedPrestige = Math.min(Math.max(0, Math.trunc(prestige)), 6);
  return PRESTIGE_MONEY_MULTIPLIERS[cappedPrestige] ?? 1;
}

export const TIER_LEVEL_REQUIREMENTS = {
  budget: 0,
  midrange: 0,
  highend: 5,
  exotic: 12,
  legendary: 22,
  mythic: 35
};

export const TASK_LEVEL_REQUIREMENTS = {
  idle: 0, bitcoin_mining: 0, ethereum_mining: 0, altcoin_mining: 0,
  ai_training: 8, protein_folding: 3, game_server: 5, stock_bot: 6,
  render_farm: 7, weather_ai: 14, deepfake_factory: 10, dark_web_server: 12,
  quantum_sim: 25, genome_sequencing: 18, nft_minting: 2, satellite_comms: 20,
  neural_net_god: 35, universe_sim: 40
};

export const WEAR_RATES = {
  budget: 0.5,
  midrange: 0.35,
  highend: 0.25,
  exotic: 0.15,
  legendary: 0.08,
  mythic: 0.08
};

export const WEAR_SPEED_MULTIPLIER = 10;

export const PRESTIGE_BONUSES = {
  1: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[1], badge: '⭐ Prestige I' },
  2: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[2], badge: '⭐⭐ Prestige II', unlocks: 'dark_web_server' },
  3: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[3], badge: '⭐⭐⭐ Prestige III', shopDiscount: 0.05 },
  4: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[4], badge: 'Prestige IV' },
  5: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[5], badge: '🌟 Prestige V', unlocks: 'universe_sim' },
  6: { earningsMultiplier: PRESTIGE_MONEY_MULTIPLIERS[6], badge: 'Prestige VI' }
};

export const marketEvents = [
  { id: 'bull_run', name: '📈 Crypto Bull Run', affectedTasks: ['bitcoin_mining','ethereum_mining','altcoin_mining'], multiplier: 2.0, duration: 4 },
  { id: 'ai_goldrush', name: '🤖 AI Gold Rush', affectedTasks: ['ai_training','neural_net_god'], multiplier: 3.0, duration: 3 },
  { id: 'supply_shortage', name: '📦 Supply Shortage', effect: 'SHOP_PRICES_UP_25', duration: 6 },
  { id: 'fire_sale', name: '🔥 Fire Sale', effect: 'RANDOM_PART_50_OFF', duration: 1 },
  { id: 'render_demand', name: '🎬 Hollywood Render Demand', affectedTasks: ['render_farm'], multiplier: 2.5, duration: 4 },
  { id: 'bear_market', name: '📉 Crypto Bear Market', affectedTasks: ['bitcoin_mining','ethereum_mining','altcoin_mining'], multiplier: 0.4, duration: 6 },
  { id: 'power_crisis', name: '⚠️ Energy Crisis', effect: 'ALL_EARNINGS_0_8', duration: 3 },
  { id: 'normal', name: '📊 Stable Markets', effect: null, duration: 2 }
];

export const TIER_COLORS = {
  budget: 0x808080,
  midrange: 0x2ecc71,
  highend: 0x3498db,
  exotic: 0x9b59b6,
  legendary: 0xf39c12,
  mythic: 0xff0000
};

export const STATUS_COLORS = {
  online: 0x00ff00,
  offline: 0xff0000,
  idle: 0xffff00,
  warning: 0xff9900
};

export const COOLDOWNS = {
  scavenge: 60 * 60 * 1000,        // 1 hour
  interaction: 1 * 1000,            // 1 second spam guard
  marketRotation: 2 * 60 * 60 * 1000 // 2 hours
};

export const PC_SLOTS = 4;
export const MAX_COLLECT_HOURS = 2;
export const STARTING_WALLET = 500;
