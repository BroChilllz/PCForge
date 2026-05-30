// utils/format.js

export function formatMoney(n) {
  if (n == null) return '$0.00';
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatScore(n) {
  if (n == null) return '0';
  return Math.round(n * 1000).toLocaleString('en-US');
}

export function wearBar(pct) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const filled = Math.round(clamped / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${clamped}%`;
}

export function tierEmoji(tier) {
  const map = {
    budget: '🟢',
    midrange: '🟡',
    highend: '🔵',
    exotic: '🟣',
    legendary: '🟠',
    mythic: '🔴'
  };
  return map[tier] || '⚪';
}

export function xpBar(current, next) {
  if (next <= current) return '[████████████████████] MAX';
  const pct = Math.min(100, (current / next) * 100);
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(pct)}%`;
}

export function shortNum(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(Math.round(n));
}

export function tierLabel(totalScore) {
  if (totalScore < 5000) return 'E-Waste Tier 🗑️';
  if (totalScore < 15000) return 'Budget Warrior 💪';
  if (totalScore < 30000) return 'Mid King 👑';
  if (totalScore < 60000) return 'High-End Enthusiast 🔥';
  if (totalScore < 120000) return 'Exotic Overlord ⚡';
  if (totalScore < 250000) return 'Legendary God Rig 🌟';
  return 'Mythic Ascendant 🌌';
}

export function statusEmoji(pc) {
  if (!pc.built) return '⚪';
  if (!pc.online || (pc.offlineUntil && new Date() < new Date(pc.offlineUntil))) return '🔴';
  if (!pc.task || pc.task === 'idle') return '🟡';
  return '🟢';
}

export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
