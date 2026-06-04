// handlers/economyHandler.js — All earnings math
import { tasks } from '../game/tasks.js';
import { parts as PARTS } from '../game/parts.js';
import { WEAR_RATES, WEAR_SPEED_MULTIPLIER, XP_THRESHOLDS, MAX_COLLECT_HOURS, marketEvents, getPrestigeMoneyMultiplier } from '../game/config.js';

export function getMarketMultiplier(marketState, taskId) {
  if (!marketState || !marketState.eventId) return 1.0;
  const event = marketEvents.find(e => e.id === marketState.eventId);
  if (!event) return 1.0;
  if (event.effect === 'ALL_EARNINGS_0_8') return 0.8;
  if (event.affectedTasks && event.affectedTasks.includes(taskId)) return event.multiplier ?? 1.0;
  return 1.0;
}

function roundMoney(value) {
  return Math.max(0, Math.round(value * 100) / 100);
}

const REPAIR_RATE = 0.25;
const MIN_REPAIR_COST_PER_PART = 5;
const THERMAL_DECAY_RATE = 0.055;

export function calculateRepairCost(pc) {
  if (!pc?.parts || !pc?.wear) return 0;

  let total = 0;
  for (const [slot, partId] of Object.entries(pc.parts)) {
    if (!partId) continue;
    const part = PARTS[partId];
    if (!part) continue;

    const wear = Math.max(0, Math.min(100, Number(pc.wear?.[slot] || 0)));
    if (wear <= 0) continue;

    const partValue = Math.max(part.price || 0, part.sellPrice || 0, 25);
    total += Math.max(MIN_REPAIR_COST_PER_PART, partValue * (wear / 100) * REPAIR_RATE);
  }

  return roundMoney(total);
}

const CORE_COMPONENTS = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'ram', label: 'RAM' }
];

const BOTTLENECK_TIERS = [
  { severity: 'severe', label: 'Severe', ratio: 0.3, multiplier: 0.6 },
  { severity: 'moderate', label: 'Moderate', ratio: 0.5, multiplier: 0.8 }
];

export function getBottleneckReport(pc) {
  const scores = CORE_COMPONENTS.map(component => {
    const part = PARTS[pc.parts?.[component.key]];
    return {
      ...component,
      part,
      score: part?.score || 0
    };
  });

  const missing = scores.filter(item => !item.part);
  if (missing.length > 0) {
    return {
      multiplier: 0,
      penaltyPercent: 100,
      severity: 'incomplete',
      strongest: null,
      bottlenecks: missing.map(item => ({
        ...item,
        severity: 'missing',
        label: 'Missing',
        ratioToStrongest: 0
      })),
      scores
    };
  }

  const strongest = scores.reduce((best, item) => item.score > best.score ? item : best, scores[0]);
  const bottlenecks = scores
    .filter(item => item.key !== strongest.key)
    .map(item => {
      const ratioToStrongest = strongest.score > 0 ? item.score / strongest.score : 1;
      const tier = BOTTLENECK_TIERS.find(candidate => ratioToStrongest < candidate.ratio);
      if (!tier) return null;
      return {
        ...item,
        severity: tier.severity,
        label: tier.label,
        ratioToStrongest
      };
    })
    .filter(Boolean);

  const activeTier = bottlenecks.some(item => item.severity === 'severe')
    ? BOTTLENECK_TIERS[0]
    : bottlenecks.length > 0
      ? BOTTLENECK_TIERS[1]
      : null;

  const multiplier = activeTier?.multiplier ?? 1.0;
  return {
    multiplier,
    penaltyPercent: Math.round((1 - multiplier) * 100),
    severity: activeTier?.severity ?? 'none',
    strongest,
    bottlenecks,
    scores
  };
}

function calculateRawEarningsPerHour(pc, player, marketState, includeVariance = true) {
  if (!pc.built || !pc.task || pc.task === 'idle' || !pc.online) return 0;
  if (pc.offlineUntil && new Date() < new Date(pc.offlineUntil)) return 0;

  const task = tasks[pc.task];
  if (!task) return 0;

  const cpuPart = PARTS[pc.parts.cpu];
  const gpuPart = PARTS[pc.parts.gpu];
  const ramPart = PARTS[pc.parts.ram];
  const psuPart = PARTS[pc.parts.psu];
  const storagePart = PARTS[pc.parts.storage];
  const storageScore = storagePart?.score || 0;
  const storageMultiplier = 1 + (storageScore * 0.02); // 2% per score point
  const moboPart = PARTS[pc.parts.motherboard];
  const moboScore = moboPart?.score || 0;
  const moboMultiplier = 1 + (moboScore * 0.01);

  // Wear penalty
  let wearMultiplier = 1.0;
  for (const wearVal of Object.values(pc.wear || {})) {
    if (wearVal >= 100) return 0;
    if (wearVal >= 80) wearMultiplier *= 0.85;
  }

  // PSU sufficiency
  const totalTdp = (cpuPart?.wattage || 0) + (gpuPart?.wattage || 0);
  let psuMultiplier = 1.0;
  if (!psuPart) {
    psuMultiplier = 0.5;
  } else if (psuPart.wattage < totalTdp) {
    psuMultiplier = 0.5; // underpowered
  } else if (psuPart.wattage >= totalTdp * 1.5) {
    psuMultiplier = 1.1; // headroom bonus — stable power delivery
  }

  // Performance scores
  const cpuScore = cpuPart?.score || 0;
  const gpuScore = gpuPart?.score || 0;
  const ramScore = ramPart?.score || 0;
  const combinedScore = (cpuScore * 0.35) + (gpuScore * 0.45) + (ramScore * 0.20);

  // Bottleneck penalty
  const bottleneckMultiplier = getBottleneckReport(pc).multiplier;

  // Earnings scaling
  const scalingBase = task.primaryStat === 'cpu' ? cpuScore
    : task.primaryStat === 'gpu' ? gpuScore
    : task.primaryStat === 'ram' ? ramScore
    : task.primaryStat === 'storage' ? storageScore
    : combinedScore;
  let scaledEarnings = task.baseEarningsPerHour * (1 + (scalingBase / 10) * task.earningsScalingFactor);

  // Task-specific modifiers
  if (task.earningsTax) scaledEarnings *= (1 - task.earningsTax);
  if (task.earningsVariance && includeVariance) {
    const variance = (Math.random() * 2 - 1) * task.earningsVariance;
    scaledEarnings *= (1 + variance);
  }

  // Market multiplier
  const marketMultiplier = getMarketMultiplier(marketState, task.id);

  // Active boost check
  let boostMultiplier = 1.0;
  if (pc.activeBoost && pc.activeBoost.expiresAt && new Date() < new Date(pc.activeBoost.expiresAt)) {
    if (['EARNINGS_2X_2HR', 'MINING_2X_4HR'].includes(pc.activeBoost.type)) {
      boostMultiplier = pc.activeBoost.multiplier || 2.0;
    }
  }

  // Prestige multiplier
  const prestigeMultiplier = getPrestigeMoneyMultiplier(player.prestige);

  return scaledEarnings
    * wearMultiplier
    * psuMultiplier
    * bottleneckMultiplier
    * marketMultiplier
    * boostMultiplier
    * prestigeMultiplier
    * storageMultiplier
    * moboMultiplier;
}

export function calculateEarningsPerHour(pc, player, marketState, options = {}) {
  const includeVariance = options.includeVariance ?? false;
  return roundMoney(calculateRawEarningsPerHour(pc, player, marketState, includeVariance));
}

export function calculateEarnings(pc, player, marketState) {
  const earningsPerHour = calculateRawEarningsPerHour(pc, player, marketState, true);

  // Hours since last collected
  const hoursSinceCollect = Math.min(
    (Date.now() - new Date(pc.lastCollected).getTime()) / 3600000,
    MAX_COLLECT_HOURS
  );

  return roundMoney(earningsPerHour * hoursSinceCollect);
}

export function applyWear(pc, hoursElapsed) {
  const coolingPart = PARTS[pc.parts.cooling];
  const coolingScore = coolingPart?.score || 0;
  // Better cooling = slower wear accumulation
  const casePart = PARTS[pc.parts.case];
  const caseScore = casePart?.score || 0;
  // Better airflow = amplifies cooling effectiveness
  const thermalBonus = 1 + (caseScore * 0.005); // small multiplier stacked on cooling
  // Apply to wearReduction in applyWear — case improves cooling efficiency
  const effectiveCoolingScore = coolingScore * thermalBonus;
  const wearReduction = 1 - Math.min(0.8, effectiveCoolingScore * 0.03); // up to 80% less wear
  if (!pc.built || !pc.task || pc.task === 'idle') return pc.wear;
  const task = tasks[pc.task];
  if (!task || task.wearRateMultiplier === 0) return pc.wear;

  const newWear = { ...pc.wear };
  const wearComponents = ['cpu', 'gpu', 'ram', 'storage', 'psu', 'cooling'];

  for (const comp of wearComponents) {
    const partId = pc.parts[comp];
    if (!partId) continue;
    const part = PARTS[partId];
    if (!part) continue;
    const baseRate = WEAR_RATES[part.tier] ?? 0.35;
    const wearIncrease = baseRate * task.wearRateMultiplier * hoursElapsed * WEAR_SPEED_MULTIPLIER * wearReduction;
    newWear[comp] = Math.min(100, (newWear[comp] || 0) + wearIncrease);
  }

  return newWear;
}

export function calculateLevelFromXp(xp, thresholds) {
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
    else break;
  }
  return level;
}

export function addXp(player, amount) {
  player.xp += amount;
  const newLevel = calculateLevelFromXp(player.xp, XP_THRESHOLDS);
  const leveled = newLevel > player.level;
  player.level = newLevel;
  return { leveled, newLevel };
}

export function analyzeBottleneck(pc) {
  const cpu = PARTS[pc.parts?.cpu];
  const gpu = PARTS[pc.parts?.gpu];
  const ram = PARTS[pc.parts?.ram];
  const psu = PARTS[pc.parts?.psu];
  const cooling = PARTS[pc.parts?.cooling];

  if (!cpu || !gpu || !ram) return ['⚠️ Missing key components — build is incomplete.'];

  const observations = [];
  const cpuScore = cpu.score;
  const gpuScore = gpu.score;
  const ramScore = ram.score;
  const combined = (cpuScore * 0.35) + (gpuScore * 0.45) + (ramScore * 0.20);

  if (gpuScore > cpuScore * 3) {
    observations.push('🖥️ Your CPU is writing a strongly-worded letter to your GPU. It\'s being completely ignored.');
  }
  if (cpuScore > gpuScore * 3) {
    observations.push('💤 Your GPU is napping. Full-time. Paid vacation.');
  }
  if (ramScore < combined * 0.3) {
    observations.push('🐌 Your RAM is the weak link. Your entire rig is waiting on it like a pizza delivery.');
  }
  if (psu) {
    const totalTdp = (cpu.wattage || 0) + (gpu.wattage || 0);
    if (psu.wattage < totalTdp) {
      observations.push('💥 Your PSU is lying to you. And itself. It will find out the hard way.');
    }
  }
  if (cooling && ['exotic', 'legendary', 'mythic'].includes(cpu.tier)) {
    if (['stock_cooler', 'cooler_budget_tower'].includes(cooling.id)) {
      observations.push('🔥 A stock cooler on THAT CPU? You absolute daredevil.');
    }
  }
  const minTier = ['budget', 'midrange', 'highend', 'exotic', 'legendary', 'mythic'];
  const cpuIdx = minTier.indexOf(cpu.tier);
  const gpuIdx = minTier.indexOf(gpu.tier);
  const ramIdx = minTier.indexOf(ram.tier);
  if (observations.length === 0 && cpuIdx >= 2 && gpuIdx >= 2 && ramIdx >= 2) {
    observations.push('✅ Textbook build. No notes. Chef\'s kiss. 🤌');
  }
  if (observations.length === 0) {
    observations.push('📊 Build looks balanced. Nothing exceptional, nothing catastrophic.');
  }

  return observations;
}

export function generateBenchmark(pc) {
  const cpu = PARTS[pc.parts?.cpu];
  const gpu = PARTS[pc.parts?.gpu];
  const ram = PARTS[pc.parts?.ram];

  if (!cpu || !gpu || !ram) return null;

  const cpuScore = Math.round(cpu.score * 1000);
  const gpuScore = Math.round(gpu.score * 1000);
  const ramScore = Math.round(ram.score * 1000);
  const totalScore = Math.round((cpu.score * 0.35 + gpu.score * 0.45 + ram.score * 0.20) * 1000);

  return { cpuScore, gpuScore, ramScore, totalScore };
}

export function getCurrentMarketEvent(player) {
  if (!player.activeEvent || !player.activeEvent.eventId) return null;
  if (new Date() > new Date(player.activeEvent.expiresAt)) return null;
  return marketEvents.find(e => e.id === player.activeEvent.eventId) || null;
}
