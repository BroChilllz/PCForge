// game/tasks.js — Task Definitions

export const tasks = {
  idle: {
    id: 'idle', name: 'Idle / Sleep', emoji: '💤',
    description: 'The PC just sits there. Gathering dust. Living its best life.',
    requirements: { minCpuScore: 0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 0, earningsScalingFactor: 0,
    primaryStat: 'none', riskLevel: 0, wearRateMultiplier: 0, levelRequired: 0,
    flavor: 'Zero earnings. Zero wear. Zero drama.'
  },
  bitcoin_mining: {
    id: 'bitcoin_mining', name: 'Bitcoin Mining', emoji: '⛏️',
    description: 'Point your GPU at the blockchain and watch the satoshis trickle in.',
    requirements: { minCpuScore: 0, minGpuScore: 3.0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 5, earningsScalingFactor: 0.8,
    primaryStat: 'gpu', riskLevel: 1, wearRateMultiplier: 1.5, levelRequired: 0,
    flavor: 'Number go up. Eventually. Hopefully.'
  },
  ethereum_mining: {
    id: 'ethereum_mining', name: 'Ethereum Mining', emoji: '💎',
    description: 'Mine ETH before someone invents a reason to stop.',
    requirements: { minCpuScore: 0, minGpuScore: 2.0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 4, earningsScalingFactor: 0.7,
    primaryStat: 'gpu', riskLevel: 1, wearRateMultiplier: 1.3, levelRequired: 0,
    flavor: 'RAM-friendly. GPU gets a workout.'
  },
  altcoin_mining: {
    id: 'altcoin_mining', name: 'Altcoin Mining', emoji: '🪙',
    description: 'Mine something with a dog on the logo. It\'ll probably moon.',
    requirements: { minCpuScore: 0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 1.5 },
    baseEarningsPerHour: 3, earningsScalingFactor: 0.5,
    primaryStat: 'combined', riskLevel: 1, wearRateMultiplier: 1.0, levelRequired: 0,
    flavor: 'Low barrier. Low expectations. Occasionally surprising.'
  },
  ai_training: {
    id: 'ai_training', name: 'AI Model Training', emoji: '🤖',
    description: 'Train neural networks. Contribute to the robot uprising.',
    requirements: { minCpuScore: 4.0, minGpuScore: 5.0, minRamScore: 3.0, minCombinedScore: 15.0 },
    baseEarningsPerHour: 20, earningsScalingFactor: 1.2,
    primaryStat: 'combined', riskLevel: 2, wearRateMultiplier: 2.0, levelRequired: 8,
    flavor: 'Requires CPU+GPU+RAM teamwork. Wear is brutal. Earnings are great.'
  },
  protein_folding: {
    id: 'protein_folding', name: 'Protein Folding', emoji: '🧬',
    description: 'Help science fold proteins. Earn karma AND cash.',
    requirements: { minCpuScore: 5.0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 8, earningsScalingFactor: 0.6,
    primaryStat: 'cpu', riskLevel: 0, wearRateMultiplier: 0.8, levelRequired: 3,
    flavor: 'No risk. CPU-focused. Karma reward each hour. Science approves.',
    karmaPerHour: 2
  },
  game_server: {
    id: 'game_server', name: 'Game Server Hosting', emoji: '🎮',
    description: 'Host servers for sweaty gamers worldwide.',
    requirements: { minCpuScore: 6.0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 12, earningsScalingFactor: 0.7,
    primaryStat: 'cpu', riskLevel: 1, wearRateMultiplier: 1.2, levelRequired: 5,
    flavor: 'Scales with core count. Players will blame lag on you anyway.'
  },
  stock_bot: {
    id: 'stock_bot', name: 'Stock Trading Bot', emoji: '📈',
    description: 'Let your PC gamble on your behalf. Legally.',
    requirements: { minCpuScore: 4.0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 10, earningsScalingFactor: 0.9,
    primaryStat: 'cpu', riskLevel: 3, wearRateMultiplier: 1.1, levelRequired: 6,
    flavor: 'Volatile. ±50% earnings variance. High risk, sometimes high reward.',
    earningsVariance: 0.5
  },
  render_farm: {
    id: 'render_farm', name: '3D Rendering Farm', emoji: '🎬',
    description: 'Render 3D scenes for studios, YouTubers, and aspiring artists.',
    requirements: { minCpuScore: 0, minGpuScore: 7.0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 16, earningsScalingFactor: 1.0,
    primaryStat: 'gpu', riskLevel: 1, wearRateMultiplier: 1.6, levelRequired: 7,
    flavor: 'GPU-heavy. High wear. Excellent for powerful GPUs.'
  },
  weather_ai: {
    id: 'weather_ai', name: 'Weather Prediction AI', emoji: '⛅',
    description: 'Predict the weather with more accuracy than your local news.',
    requirements: { minCpuScore: 5.0, minGpuScore: 5.0, minRamScore: 4.0, minCombinedScore: 18.0 },
    baseEarningsPerHour: 25, earningsScalingFactor: 1.1,
    primaryStat: 'combined', riskLevel: 1, wearRateMultiplier: 1.8, levelRequired: 14,
    flavor: 'High RAM requirement. Balanced system required. Great pay.'
  },
  deepfake_factory: {
    id: 'deepfake_factory', name: 'Deepfake Factory', emoji: '👁️',
    description: 'Questionable content. 10% earnings go to the legal fund.',
    requirements: { minCpuScore: 0, minGpuScore: 9.0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 22, earningsScalingFactor: 1.0,
    primaryStat: 'gpu', riskLevel: 2, wearRateMultiplier: 1.9, levelRequired: 10,
    flavor: 'High GPU requirement. 10% earnings tax. Legally ambiguous.',
    earningsTax: 0.10
  },
  dark_web_server: {
    id: 'dark_web_server', name: 'Dark Web Server', emoji: '🕸️',
    description: 'Host services on the dark web. Don\'t ask, don\'t tell.',
    requirements: { minCpuScore: 0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 5.0 },
    baseEarningsPerHour: 30, earningsScalingFactor: 0.8,
    primaryStat: 'combined', riskLevel: 5, wearRateMultiplier: 2.5, levelRequired: 12,
    flavor: 'Best base pay. 8% raid chance per hour. Prestige 2+ to unlock.',
    raidChancePerHour: 0.08
  },
  quantum_sim: {
    id: 'quantum_sim', name: 'Quantum Simulation', emoji: '⚛️',
    description: 'Simulate quantum systems for research institutions.',
    requirements: { minCpuScore: 10.0, minGpuScore: 10.0, minRamScore: 8.0, minCombinedScore: 45.0 },
    baseEarningsPerHour: 80, earningsScalingFactor: 1.5,
    primaryStat: 'combined', riskLevel: 2, wearRateMultiplier: 2.2, levelRequired: 25,
    flavor: 'Legendary+ components only. Incredible pay. Wear is significant.'
  },
  genome_sequencing: {
    id: 'genome_sequencing', name: 'Genome Sequencing', emoji: '🧪',
    description: 'Sequence genomes for pharmaceutical companies.',
    requirements: { minCpuScore: 20.0, minGpuScore: 0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 35, earningsScalingFactor: 1.2,
    primaryStat: 'cpu', riskLevel: 1, wearRateMultiplier: 1.7, levelRequired: 18,
    flavor: 'CPU-intensive. Science-adjacent. Pays well.'
  },
  nft_minting: {
    id: 'nft_minting', name: 'NFT Minting', emoji: '🖼️',
    description: 'Mint JPEGs and sell the idea of ownership.',
    requirements: { minCpuScore: 0, minGpuScore: 3.0, minRamScore: 0, minCombinedScore: 0 },
    baseEarningsPerHour: 7, earningsScalingFactor: 0.6,
    primaryStat: 'gpu', riskLevel: 1, wearRateMultiplier: 1.2, levelRequired: 2,
    flavor: 'We\'re not judging. Okay, we\'re judging a little.'
  },
  satellite_comms: {
    id: 'satellite_comms', name: 'Satellite Comms Node', emoji: '📡',
    description: 'Route satellite communications for aerospace clients.',
    requirements: { minCpuScore: 8.0, minGpuScore: 6.0, minRamScore: 5.0, minCombinedScore: 28.0 },
    baseEarningsPerHour: 45, earningsScalingFactor: 1.3,
    primaryStat: 'combined', riskLevel: 2, wearRateMultiplier: 2.0, levelRequired: 20,
    flavor: 'Exotic+ components required. Space-tier pay.'
  },
  neural_net_god: {
    id: 'neural_net_god', name: 'Neural Net God Mode', emoji: '🧠',
    description: 'Train the largest models. You\'re not building AI, you ARE the AI.',
    requirements: { minCpuScore: 20.0, minGpuScore: 30.0, minRamScore: 15.0, minCombinedScore: 90.0 },
    baseEarningsPerHour: 200, earningsScalingFactor: 2.0,
    primaryStat: 'combined', riskLevel: 3, wearRateMultiplier: 3.0, levelRequired: 35,
    flavor: 'Mythic components only. Life-changing earnings. Brutal wear.'
  },
  universe_sim: {
    id: 'universe_sim', name: 'Universe Simulation', emoji: '🌌',
    description: 'Simulate entire universes. The stakes are cosmological.',
    requirements: { minCpuScore: 50.0, minGpuScore: 80.0, minRamScore: 50.0, minCombinedScore: 180.0 },
    baseEarningsPerHour: 1000, earningsScalingFactor: 3.0,
    primaryStat: 'combined', riskLevel: 1, wearRateMultiplier: 1.5, levelRequired: 40,
    flavor: 'Mythic only. Prestige 5+. The endgame. Four figures per hour.'
  }
};

export function getTaskById(id) {
  return tasks[id] || null;
}

export function getAvailableTasks(player, pc, partsData) {
  if (!pc.built) return [];
  const cpu = partsData[pc.parts.cpu];
  const gpu = partsData[pc.parts.gpu];
  const ram = partsData[pc.parts.ram];
  if (!cpu || !gpu || !ram) return [];

  const combined = (cpu.score * 0.35) + (gpu.score * 0.45) + (ram.score * 0.20);

  return Object.values(tasks).filter(task => {
    if (task.id === 'dark_web_server' && player.prestige < 2) return false;
    if (task.id === 'universe_sim' && player.prestige < 5) return false;
    if (player.level < task.levelRequired) return false;
    if (cpu.score < task.requirements.minCpuScore) return false;
    if (gpu.score < task.requirements.minGpuScore) return false;
    if (ram.score < task.requirements.minRamScore) return false;
    if (combined < task.requirements.minCombinedScore) return false;
    return true;
  });
}
