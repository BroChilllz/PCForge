// game/events.js — Random Event Definitions

export const events = [
  { id: 'mystery_box', name: '🎁 Mystery Box Drop', probability: 0.03, effect: 'ADD_RANDOM_PART',
    description: 'A random component fell out of the internet.' },
  { id: 'overclock_surge', name: '⚡ Overclock Surge', probability: 0.04, effect: 'EARNINGS_2X_2HR',
    description: 'Your rig briefly transcended its specifications.' },
  { id: 'thermal_event', name: '🔥 Thermal Event', probability: 0.02, effect: 'WEAR_DAMAGE_20_GPU',
    description: 'Temperatures exceeded recommended limits. The GPU noticed.' },
  { id: 'flash_sale', name: '🛍️ Flash Sale', probability: 0.03, effect: 'SHOP_DISCOUNT_40',
    description: '40% off the shop for 1 hour. Go spend.' },
  { id: 'virus_attack', name: '👾 Virus Attack', probability: 0.02, effect: 'PC_OFFLINE_1HR',
    description: 'Malicious process detected. Going offline to quarantine.' },
  { id: 'raid', name: '🚨 Server Raid', probability: 0, effect: 'LOSE_EARNINGS',
    description: 'The feds knocked. You lost your pending earnings.' },
  { id: 'part_failure', name: '💀 Component Failure', probability: 0.01, effect: 'PART_FAIL_RANDOM',
    description: 'A component gave up the ghost. RIP.' },
  { id: 'crypto_bonus', name: '🚀 Crypto Pump', probability: 0.03, effect: 'MINING_2X_4HR',
    description: 'Crypto is going to the moon. Mining earnings doubled for 4 hours.' },
  { id: 'power_surge', name: '⚡ Power Surge', probability: 0.015, effect: 'PSU_WEAR_30',
    description: 'Voltage spike. Your PSU took one for the team.' },
  { id: 'driver_crash', name: '💻 Driver Crash', probability: 0.02, effect: 'GPU_TASKS_OFFLINE_30MIN',
    description: 'GPU driver crashed. Rebooting. GPU tasks offline for 30 min.' },
  { id: 'blessing', name: '🌟 Silicon Blessing', probability: 0.01, effect: 'WEAR_HEAL_ALL_20',
    description: 'The silicon gods smile upon you. All components healed 20% wear.' }
];

export function rollEvent(riskLevel, taskId) {
  const results = [];
  for (const event of events) {
    let prob = event.probability;
    // Scale raid probability by riskLevel
    if (event.id === 'raid') {
      prob = taskId === 'dark_web_server' ? 0.08 : riskLevel * 0.005;
    } else {
      // Higher risk = slightly more bad events
      if (['thermal_event', 'virus_attack', 'part_failure', 'power_surge', 'driver_crash'].includes(event.id)) {
        prob *= (1 + riskLevel * 0.3);
      }
    }
    if (Math.random() < prob) {
      results.push(event);
    }
  }
  return results;
}
