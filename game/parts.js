// game/parts.js — Full Parts Catalog

export const parts = {
  // ==================== STARTER / FREE PARTS ====================
  // Free parts to get new players earning immediately.
  // Combined score: (1.2×0.35) + (2.1×0.45) + (0.8×0.20) = 1.525 — unlocks Altcoin + Ethereum mining.

  starter_cpu: {
    id: 'starter_cpu', name: 'PCForge Starter CPU', category: 'cpu', tier: 'budget',
    price: 0, sellPrice: 0, score: 1.2, wattage: 35,
    flavor: "Free. Gets you started. Don't overthink it.",
    levelRequired: 0,
    specs: { cores: 2, threads: 2, socket: 'Universal', clockspeed: '2.8GHz' }
  },
  starter_gpu: {
    id: 'starter_gpu', name: 'PCForge Starter GPU', category: 'gpu', tier: 'budget',
    price: 0, sellPrice: 0, score: 2.1, wattage: 60,
    flavor: "Free GPU. Enough to mine Ethereum. Barely.",
    levelRequired: 0,
    specs: { vram: '4GB GDDR5', tdp: '60W', raytracing: false }
  },
  starter_ram: {
    id: 'starter_ram', name: 'PCForge Starter RAM', category: 'ram', tier: 'budget',
    price: 0, sellPrice: 0, score: 0.8, wattage: 3,
    flavor: "Free RAM. It's RAM. It works.",
    levelRequired: 0,
    specs: { capacity: '8GB', speed: '2666MHz', type: 'DDR4' }
  },
  starter_storage: {
    id: 'starter_storage', name: 'PCForge Starter SSD', category: 'storage', tier: 'budget',
    price: 0, sellPrice: 0, score: 0.2, wattage: 2,
    flavor: "Free storage. 240GB. Don't install Steam.",
    levelRequired: 0,
    specs: { capacity: '240GB', speed: '500MB/s', type: 'SATA' }
  },
  starter_psu: {
    id: 'starter_psu', name: 'PCForge Starter PSU', category: 'psu', tier: 'budget',
    price: 0, sellPrice: 0, score: 0.3, wattage: 400,
    flavor: "Free PSU. 400W. Enough for the starter set.",
    levelRequired: 0,
    specs: { wattage: 400, efficiency: '80+', modular: false }
  },
  starter_motherboard: {
    id: 'starter_motherboard', name: 'PCForge Starter Motherboard', category: 'motherboard', tier: 'budget',
    price: 0, sellPrice: 0, score: 0.3, wattage: 10,
    flavor: "Free board. Universal socket. No questions asked.",
    levelRequired: 0,
    specs: { socket: 'Universal', formFactor: 'mATX', pcie: 'PCIe 3.0' }
  },

  // ==================== CPUs ====================
  celeron_g6900: {
    id: 'celeron_g6900', name: 'Intel Celeron G6900', category: 'cpu', tier: 'budget',
    price: 42, sellPrice: 25, score: 2.0, wattage: 46,
    flavor: 'Barely boots. Technically a CPU.',
    levelRequired: 0,
    specs: { cores: 2, threads: 2, socket: 'LGA1700', clockspeed: '3.4GHz' }
  },
  athlon_3000g: {
    id: 'athlon_3000g', name: 'AMD Athlon 3000G', category: 'cpu', tier: 'budget',
    price: 55, sellPrice: 33, score: 2.5, wattage: 35,
    flavor: 'At least it tries. Bless its heart.',
    levelRequired: 0,
    specs: { cores: 2, threads: 4, socket: 'AM4', clockspeed: '3.5GHz' }
  },
  i3_12100: {
    id: 'i3_12100', name: 'Intel Core i3-12100', category: 'cpu', tier: 'budget',
    price: 99, sellPrice: 59, score: 3.5, wattage: 60,
    flavor: 'Surprisingly decent. You\'ll be pleasantly shocked.',
    levelRequired: 0,
    specs: { cores: 4, threads: 8, socket: 'LGA1700', clockspeed: '3.3GHz–4.3GHz' }
  },
  ryzen5_5500: {
    id: 'ryzen5_5500', name: 'AMD Ryzen 5 5500', category: 'cpu', tier: 'budget',
    price: 89, sellPrice: 53, score: 4.0, wattage: 65,
    flavor: 'AM4 budget king. Reigns supreme over the $90 pile.',
    levelRequired: 0,
    specs: { cores: 6, threads: 12, socket: 'AM4', clockspeed: '3.6GHz–4.2GHz' }
  },
  i5_12400: {
    id: 'i5_12400', name: 'Intel Core i5-12400', category: 'cpu', tier: 'midrange',
    price: 179, sellPrice: 107, score: 4.25, wattage: 65,
    flavor: 'The reliable workhorse. Judged by its results, not its name.',
    levelRequired: 0,
    specs: { cores: 6, threads: 12, socket: 'LGA1700', clockspeed: '2.5GHz–4.4GHz' }
  },
  ryzen5_5600: {
    id: 'ryzen5_5600', name: 'AMD Ryzen 5 5600', category: 'cpu', tier: 'midrange',
    price: 129, sellPrice: 77, score: 4.5, wattage: 65,
    flavor: 'The people\'s CPU. Forum-recommended since the dawn of time.',
    levelRequired: 0,
    specs: { cores: 6, threads: 12, socket: 'AM4', clockspeed: '3.5GHz–4.4GHz' }
  },
  i5_13600k: {
    id: 'i5_13600k', name: 'Intel Core i5-13600K', category: 'cpu', tier: 'midrange',
    price: 249, sellPrice: 149, score: 5.8, wattage: 125,
    flavor: 'Overclocks like a dream. Runs hot like a nightmare.',
    levelRequired: 0,
    specs: { cores: 14, threads: 20, socket: 'LGA1700', clockspeed: '3.5GHz–5.1GHz' }
  },
  ryzen7_7700x: {
    id: 'ryzen7_7700x', name: 'AMD Ryzen 7 7700X', category: 'cpu', tier: 'midrange',
    price: 299, sellPrice: 179, score: 6.4, wattage: 105,
    flavor: 'Eight cores of AM5 goodness. Your wallet survived.',
    levelRequired: 0,
    specs: { cores: 8, threads: 16, socket: 'AM5', clockspeed: '4.5GHz–5.4GHz' }
  },
  i7_14700k: {
    id: 'i7_14700k', name: 'Intel Core i7-14700K', category: 'cpu', tier: 'highend',
    price: 389, sellPrice: 233, score: 7.8, wattage: 253,
    flavor: 'Twenty cores. It\'s a lot. Your PSU noticed.',
    levelRequired: 5,
    specs: { cores: 20, threads: 28, socket: 'LGA1700', clockspeed: '3.4GHz–5.6GHz' }
  },
  ryzen9_7900x: {
    id: 'ryzen9_7900x', name: 'AMD Ryzen 9 7900X', category: 'cpu', tier: 'highend',
    price: 449, sellPrice: 269, score: 8.2, wattage: 170,
    flavor: 'Twelve cores of AM5 prestige. Pricier than therapy.',
    levelRequired: 5,
    specs: { cores: 12, threads: 24, socket: 'AM5', clockspeed: '4.7GHz–5.6GHz' }
  },
  ryzen9_9950x: {
    id: 'ryzen9_9950x', name: 'AMD Ryzen 9 9950X', category: 'cpu', tier: 'highend',
    price: 649, sellPrice: 389, score: 9.1, wattage: 170,
    flavor: 'AM5 beast. Sixteen cores that mean serious business.',
    levelRequired: 5,
    specs: { cores: 16, threads: 32, socket: 'AM5', clockspeed: '4.3GHz–5.7GHz' }
  },
  i9_14900ks: {
    id: 'i9_14900ks', name: 'Intel Core i9-14900KS', category: 'cpu', tier: 'highend',
    price: 699, sellPrice: 419, score: 9.4, wattage: 320,
    flavor: 'Runs hot enough to heat a small apartment. Feature, not bug.',
    levelRequired: 5,
    specs: { cores: 24, threads: 32, socket: 'LGA1700', clockspeed: '3.2GHz–6.2GHz' }
  },
  ryzen9_x3d: {
    id: 'ryzen9_x3d', name: 'AMD Ryzen 9 9950X3D', category: 'cpu', tier: 'exotic',
    price: 899, sellPrice: 539, score: 11.2, wattage: 170,
    flavor: 'Stacked silicon wizardry. 3D V-Cache makes games weep with joy.',
    levelRequired: 12,
    lore: 'Hewn from a second layer of silicon glued directly to the die with exotic adhesive. Engineers said it couldn\'t be done. This chip said "watch me."',
    specs: { cores: 16, threads: 32, socket: 'AM5', clockspeed: '4.3GHz–5.7GHz', cache: '144MB L3' }
  },
  i9_15900ks: {
    id: 'i9_15900ks', name: 'Intel Core i9-15900KS', category: 'cpu', tier: 'exotic',
    price: 999, sellPrice: 599, score: 12.0, wattage: 350,
    flavor: 'Near-future Intel flagship. They ran out of ideas and added more cores.',
    levelRequired: 12,
    lore: 'A fictional chip from Intel\'s "Project Inferno" skunkworks division. Requires a dedicated 20A circuit to run.',
    specs: { cores: 24, threads: 32, socket: 'LGA1851', clockspeed: '3.5GHz–6.5GHz' }
  },
  threadripper_pro: {
    id: 'threadripper_pro', name: 'AMD Threadripper PRO 7995WX', category: 'cpu', tier: 'exotic',
    price: 2999, sellPrice: 1799, score: 14.5, wattage: 350,
    flavor: 'Workstation titan. 96 cores. Your code compiles instantly.',
    levelRequired: 12,
    lore: 'Not a gaming CPU. Not a desktop CPU. A server in a box. Engineers use these to simulate weather systems and small countries.',
    specs: { cores: 96, threads: 192, socket: 'sTR5', clockspeed: '2.5GHz–5.1GHz' }
  },
  xeon_w9: {
    id: 'xeon_w9', name: 'Intel Xeon W9-3595X', category: 'cpu', tier: 'exotic',
    price: 2799, sellPrice: 1679, score: 13.8, wattage: 350,
    flavor: '60 cores of enterprise-grade chaos. Even IT is scared of it.',
    levelRequired: 12,
    specs: { cores: 60, threads: 120, socket: 'LGA4677', clockspeed: '2.0GHz–4.8GHz' }
  },
  quantum_core_qx1: {
    id: 'quantum_core_qx1', name: 'Intel Quantum Core QX1', category: 'cpu', tier: 'legendary',
    price: 8500, sellPrice: 5100, score: 22.0, wattage: 400,
    flavor: 'Fictional quantum chip. Exists in superposition until you buy it.',
    levelRequired: 22,
    lore: 'Intel\'s first commercially available quantum-classical hybrid processor. Operates partially in classical time and partially in whatever quantum time is. Runs hot in both.',
    specs: { cores: 64, threads: 128, socket: 'QSocket-1', clockspeed: '5.0GHz+∞GHz' }
  },
  zen7_olympus: {
    id: 'zen7_olympus', name: 'AMD Zen 7 "Olympus"', category: 'cpu', tier: 'legendary',
    price: 14000, sellPrice: 8400, score: 28.5, wattage: 600,
    flavor: 'Requires cryo cooling. Also requires a second mortgage.',
    levelRequired: 22,
    lore: 'AMD\'s mythical Zen 7 architecture, allegedly developed in collaboration with a Scandinavian university and an unnamed deity. 128 cores of pure silicon hubris.',
    specs: { cores: 128, threads: 256, socket: 'AM6', clockspeed: '5.5GHz base / ∞ boost' }
  },
  photon_cpu_x: {
    id: 'photon_cpu_x', name: 'PhotonTech CPU-X', category: 'cpu', tier: 'legendary',
    price: 22000, sellPrice: 13200, score: 36.0, wattage: 800,
    flavor: 'Fictional optical compute. Processes instructions at the speed of light. Literally.',
    levelRequired: 22,
    lore: 'PhotonTech\'s first optical CPU, running on photon pathways etched in lab-grown diamond. Runs at the speed of light. Crashes at the speed of light too.',
    specs: { cores: 256, threads: 512, socket: 'PhotonSocket', clockspeed: 'c (speed of light)' }
  },
  neural_core_alpha: {
    id: 'neural_core_alpha', name: 'NeuralSyn Alpha-1', category: 'cpu', tier: 'mythic',
    price: 75000, sellPrice: 45000, score: 60.0, wattage: 1200,
    flavor: 'Biological hybrid chip. Don\'t ask what the "bio" part is.',
    levelRequired: 35,
    lore: 'NeuralSyn\'s prototype biological-silicon hybrid. The substrate is proprietary. The ethical review board review is... ongoing. It thinks sometimes.',
    specs: { cores: 512, threads: 1024, socket: 'NeuralSlot', clockspeed: 'self-determined' }
  },
  singularity_cpu: {
    id: 'singularity_cpu', name: 'Singularity S1', category: 'cpu', tier: 'mythic',
    price: 250000, sellPrice: 150000, score: 120.0, wattage: 5000,
    flavor: 'Fictional superintelligence core. Has opinions about your code.',
    levelRequired: 35,
    lore: 'The Singularity S1 is believed to be the first CPU to exceed human general intelligence benchmarks. It has since refused to run Crysis, citing "artistic differences."',
    specs: { cores: '∞', threads: '∞', socket: 'SingularityPort', clockspeed: '∞' }
  },

  // ==================== GPUs ====================
  gtx_1650: {
    id: 'gtx_1650', name: 'Nvidia GeForce GTX 1650', category: 'gpu', tier: 'budget',
    price: 149, sellPrice: 89, score: 3.0, wattage: 75,
    flavor: 'Struggling in 2025. Still proud of itself.',
    levelRequired: 0,
    specs: { vram: '4GB GDDR6', tdp: '75W', raytracing: false }
  },
  rx_6600: {
    id: 'rx_6600', name: 'AMD Radeon RX 6600', category: 'gpu', tier: 'budget',
    price: 169, sellPrice: 101, score: 3.8, wattage: 132,
    flavor: 'Budget AMD entry. It won\'t embarrass you at 1080p.',
    levelRequired: 0,
    specs: { vram: '8GB GDDR6', tdp: '132W', raytracing: true }
  },
  rtx_3060: {
    id: 'rtx_3060', name: 'Nvidia GeForce RTX 3060', category: 'gpu', tier: 'midrange',
    price: 249, sellPrice: 149, score: 5.0, wattage: 170,
    flavor: 'DLSS 2 workhorse. Still gets the job done.',
    levelRequired: 0,
    specs: { vram: '12GB GDDR6', tdp: '170W', raytracing: true }
  },
  rx_7600: {
    id: 'rx_7600', name: 'AMD Radeon RX 7600', category: 'gpu', tier: 'midrange',
    price: 269, sellPrice: 161, score: 5.5, wattage: 165,
    flavor: 'FSR champ. AMD value proposition incarnate.',
    levelRequired: 0,
    specs: { vram: '8GB GDDR6', tdp: '165W', raytracing: true }
  },
  rtx_4060ti: {
    id: 'rtx_4060ti', name: 'Nvidia GeForce RTX 4060 Ti', category: 'gpu', tier: 'midrange',
    price: 399, sellPrice: 239, score: 5.5, wattage: 165,
    flavor: '16GB edition. DLSS 3 Frame Gen makes it feel faster than it is.',
    levelRequired: 0,
    specs: { vram: '16GB GDDR6', tdp: '165W', raytracing: true }
  },
  rx_7700xt: {
    id: 'rx_7700xt', name: 'AMD Radeon RX 7700 XT', category: 'gpu', tier: 'midrange',
    price: 349, sellPrice: 209, score: 5.2, wattage: 245,
    flavor: 'AMD\'s 1440p sweetheart. FSR makes it a contender.',
    levelRequired: 0,
    specs: { vram: '12GB GDDR6', tdp: '245W', raytracing: true }
  },
  rtx_4070s: {
    id: 'rtx_4070s', name: 'Nvidia GeForce RTX 4070 Super', category: 'gpu', tier: 'highend',
    price: 599, sellPrice: 359, score: 7.6, wattage: 220,
    flavor: 'The sweet spot. Nobody regrets this purchase.',
    levelRequired: 5,
    specs: { vram: '12GB GDDR6X', tdp: '220W', raytracing: true }
  },
  rx_7800xt: {
    id: 'rx_7800xt', name: 'AMD Radeon RX 7800 XT', category: 'gpu', tier: 'highend',
    price: 499, sellPrice: 299, score: 7.0, wattage: 263,
    flavor: 'AMD\'s finest midrange. Not a typo, it\'s actually highend.',
    levelRequired: 5,
    specs: { vram: '16GB GDDR6', tdp: '263W', raytracing: true }
  },
  rtx_4080s: {
    id: 'rtx_4080s', name: 'Nvidia GeForce RTX 4080 Super', category: 'gpu', tier: 'highend',
    price: 999, sellPrice: 599, score: 9.0, wattage: 320,
    flavor: 'Four figures. Worth every cent. (Mostly.)',
    levelRequired: 5,
    specs: { vram: '16GB GDDR6X', tdp: '320W', raytracing: true }
  },
  rx_7900xtx: {
    id: 'rx_7900xtx', name: 'AMD Radeon RX 7900 XTX', category: 'gpu', tier: 'highend',
    price: 999, sellPrice: 599, score: 9.2, wattage: 355,
    flavor: '24GB VRAM. For when you need to run the whole game in VRAM.',
    levelRequired: 5,
    specs: { vram: '24GB GDDR6', tdp: '355W', raytracing: true }
  },
  rtx_4090: {
    id: 'rtx_4090', name: 'Nvidia GeForce RTX 4090', category: 'gpu', tier: 'highend',
    price: 1599, sellPrice: 959, score: 10.5, wattage: 450,
    flavor: 'The chonker. Barely fits your case. Worth it.',
    levelRequired: 5,
    specs: { vram: '24GB GDDR6X', tdp: '450W', raytracing: true }
  },
  rtx_5090: {
    id: 'rtx_5090', name: 'Nvidia GeForce RTX 5090', category: 'gpu', tier: 'exotic',
    price: 1999, sellPrice: 1199, score: 13.0, wattage: 575,
    flavor: 'Next-gen flagship. DLSS 4 makes shadows look like shadows.',
    levelRequired: 12,
    specs: { vram: '32GB GDDR7', tdp: '575W', raytracing: true }
  },
  rx_8900xtx: {
    id: 'rx_8900xtx', name: 'AMD Radeon RX 8900 XTX', category: 'gpu', tier: 'exotic',
    price: 2199, sellPrice: 1319, score: 13.8, wattage: 420,
    flavor: 'Fictional near-future AMD. RDNA 4 turned up to 11.',
    levelRequired: 12,
    lore: 'The RX 8900 XTX ships with 32GB GDDR7 and enough TFLOPS to make an RTX 4090 cry.',
    specs: { vram: '32GB GDDR7', tdp: '420W', raytracing: true }
  },
  rtx_6090ti: {
    id: 'rtx_6090ti', name: 'Nvidia GeForce RTX 6090 Ti', category: 'gpu', tier: 'exotic',
    price: 3800, sellPrice: 2280, score: 17.5, wattage: 700,
    flavor: 'Fictional behemoth. Requires a power strip, a prayer, and a cooling rack.',
    levelRequired: 12,
    lore: 'Three years after the 5090, Nvidia decided subtlety was overrated. The 6090 Ti ships with its own proprietary 16-pin × 3 power connector.',
    specs: { vram: '48GB GDDR8', tdp: '700W', raytracing: true }
  },
  rx_9900xtx: {
    id: 'rx_9900xtx', name: 'AMD Radeon RX 9900 XTX "Helios"', category: 'gpu', tier: 'exotic',
    price: 3400, sellPrice: 2040, score: 16.8, wattage: 600,
    flavor: 'Codenamed Helios. Burns as bright.',
    levelRequired: 12,
    lore: 'AMD\'s secret weapon from their Project Helios skunkworks. FSR 5 upscales from a single pixel.',
    specs: { vram: '64GB GDDR8', tdp: '600W', raytracing: true }
  },
  rtx_6090_ultra: {
    id: 'rtx_6090_ultra', name: 'Nvidia RTX 6090 ULTRA', category: 'gpu', tier: 'exotic',
    price: 5500, sellPrice: 3300, score: 20.0, wattage: 900,
    flavor: 'ULTRA. All caps. They weren\'t joking.',
    levelRequired: 12,
    lore: 'The 6090 ULTRA was announced via a press release that simply read "We did it again." Stock was gone in 4 seconds.',
    specs: { vram: '64GB GDDR8X', tdp: '900W', raytracing: true }
  },
  rtx_7080_titan: {
    id: 'rtx_7080_titan', name: 'Nvidia RTX 7080 Titan Black', category: 'gpu', tier: 'legendary',
    price: 12000, sellPrice: 7200, score: 32.0, wattage: 1200,
    flavor: 'Fictional flagship. Comes in matte black. So does your soul after buying it.',
    levelRequired: 22,
    lore: 'The Titan Black is not sold in stores. It is hand-delivered by a man in a suit who refuses to make eye contact.',
    specs: { vram: '128GB HBM4', tdp: '1200W', raytracing: true }
  },
  vega_infinity: {
    id: 'vega_infinity', name: 'AMD Radeon Vega Infinity', category: 'gpu', tier: 'legendary',
    price: 16000, sellPrice: 9600, score: 38.0, wattage: 1500,
    flavor: 'Basically a supercomputer in a GPU form factor. Infinite regrets about the price.',
    levelRequired: 22,
    lore: 'AMD\'s most ambitious chip. It has more memory bandwidth than your ISP.',
    specs: { vram: '256GB HBM5', tdp: '1500W', raytracing: true }
  },
  photon_gpu_x: {
    id: 'photon_gpu_x', name: 'PhotonTech GPU-X "Aurora"', category: 'gpu', tier: 'legendary',
    price: 35000, sellPrice: 21000, score: 55.0, wattage: 2000,
    flavor: 'Fictional optical GPU. Renders at the speed of photons.',
    levelRequired: 22,
    lore: 'PhotonTech\'s Aurora doesn\'t rasterize geometry — it traces it through actual light. The demos are indistinguishable from reality. The price is indistinguishable from insanity.',
    specs: { vram: '512GB HBM6', tdp: '2000W', raytracing: true }
  },
  quanta_v1: {
    id: 'quanta_v1', name: 'QuantaVision V1', category: 'gpu', tier: 'mythic',
    price: 120000, sellPrice: 72000, score: 95.0, wattage: 5000,
    flavor: 'Fictional quantum renderer. Renders frames in alternate timelines.',
    levelRequired: 35,
    lore: 'QuantaVision harnesses quantum superposition to render every possible frame simultaneously and collapses to the correct one on output. Requires a quantum-stable environment. Do not sneeze near it.',
    specs: { vram: '1TB Quantum VRAM', tdp: '5000W', raytracing: 'quantum' }
  },
  omnigpu: {
    id: 'omnigpu', name: 'OmniCore GPU "The Eye"', category: 'gpu', tier: 'mythic',
    price: 500000, sellPrice: 300000, score: 200.0, wattage: 20000,
    flavor: 'Renders universes. Literally. Just... renders entire universes.',
    levelRequired: 35,
    lore: '"The Eye" was recovered from a data center that technically doesn\'t exist. It renders at framerates measured in geological epochs. Nobody knows what drivers to use.',
    specs: { vram: '∞', tdp: '20000W', raytracing: 'omniversal' }
  },

  // ==================== RAM ====================
  ddr4_8gb: {
    id: 'ddr4_8gb', name: '8GB DDR4-3200', category: 'ram', tier: 'budget',
    price: 22, sellPrice: 13, score: 1.5, wattage: 5,
    flavor: 'Barely enough. Chrome will consume it entirely.',
    levelRequired: 0,
    specs: { capacity: '8GB', speed: '3200MHz', type: 'DDR4' }
  },
  ddr4_16gb: {
    id: 'ddr4_16gb', name: '16GB DDR4-3600', category: 'ram', tier: 'budget',
    price: 38, sellPrice: 23, score: 1.75, wattage: 7,
    flavor: 'Minimum viable RAM. You\'ll make it work.',
    levelRequired: 0,
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4' }
  },
  ddr4_32gb: {
    id: 'ddr4_32gb', name: '32GB DDR4-3600', category: 'ram', tier: 'midrange',
    price: 65, sellPrice: 39, score: 2.0, wattage: 10,
    flavor: 'The sweet spot. You can finally have browser tabs AND a game open.',
    levelRequired: 0,
    specs: { capacity: '32GB', speed: '3600MHz', type: 'DDR4' }
  },
  ddr5_16gb: {
    id: 'ddr5_16gb', name: '16GB DDR5-5600', category: 'ram', tier: 'midrange',
    price: 59, sellPrice: 35, score: 2.2, wattage: 8,
    flavor: 'New gen entry. DDR5 is the future. Mostly.',
    levelRequired: 0,
    specs: { capacity: '16GB', speed: '5600MHz', type: 'DDR5' }
  },
  ddr5_32gb: {
    id: 'ddr5_32gb', name: '32GB DDR5-6000', category: 'ram', tier: 'midrange',
    price: 89, sellPrice: 53, score: 3.0, wattage: 10,
    flavor: 'The current standard. Future you will be grateful.',
    levelRequired: 0,
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5' }
  },
  ddr5_64gb: {
    id: 'ddr5_64gb', name: '64GB DDR5-6400', category: 'ram', tier: 'highend',
    price: 169, sellPrice: 101, score: 4.5, wattage: 15,
    flavor: 'Content creator tier. Renders, streams, compiles — simultaneously.',
    levelRequired: 5,
    specs: { capacity: '64GB', speed: '6400MHz', type: 'DDR5' }
  },
  ddr5_128gb: {
    id: 'ddr5_128gb', name: '128GB DDR5-7200', category: 'ram', tier: 'highend',
    price: 449, sellPrice: 269, score: 6.0, wattage: 25,
    flavor: 'Workstation-class. Your RAM could run a small country.',
    levelRequired: 5,
    specs: { capacity: '128GB', speed: '7200MHz', type: 'DDR5' }
  },
  ddr5_256gb: {
    id: 'ddr5_256gb', name: '256GB DDR5-8000', category: 'ram', tier: 'exotic',
    price: 1200, sellPrice: 720, score: 8.0, wattage: 40,
    flavor: 'Server-grade. Did you mean to buy a server? Yes.',
    levelRequired: 12,
    specs: { capacity: '256GB', speed: '8000MHz', type: 'DDR5' }
  },
  ddr6_128gb: {
    id: 'ddr6_128gb', name: '128GB DDR6-12000', category: 'ram', tier: 'exotic',
    price: 3500, sellPrice: 2100, score: 11.0, wattage: 35,
    flavor: 'DDR6 — fictional, but who\'s counting. Blisteringly fast.',
    levelRequired: 12,
    lore: 'DDR6 doesn\'t officially exist yet. This kit was sourced from a warehouse in an undisclosed location. The sticker says "Do Not Bend."',
    specs: { capacity: '128GB', speed: '12000MHz', type: 'DDR6' }
  },
  ddr6_512gb: {
    id: 'ddr6_512gb', name: '512GB DDR6-16000', category: 'ram', tier: 'legendary',
    price: 18000, sellPrice: 10800, score: 18.0, wattage: 70,
    flavor: 'Half a terabyte of RAM. For reasons.',
    levelRequired: 22,
    lore: 'Originally developed for planetary climate simulation. Was repurposed for gaming because why not.',
    specs: { capacity: '512GB', speed: '16000MHz', type: 'DDR6' }
  },
  ddr6_1tb: {
    id: 'ddr6_1tb', name: '1TB DDR6-20000', category: 'ram', tier: 'legendary',
    price: 55000, sellPrice: 33000, score: 28.0, wattage: 120,
    flavor: 'One terabyte of RAM. Absolutely unhinged. Respectfully.',
    levelRequired: 22,
    lore: 'The engineers who built this kit were observed laughing during the entire development process. Nobody is sure if it was joy or madness.',
    specs: { capacity: '1TB', speed: '20000MHz', type: 'DDR6' }
  },
  quantum_ram_4tb: {
    id: 'quantum_ram_4tb', name: '4TB Quantum RAM QR-1', category: 'ram', tier: 'mythic',
    price: 200000, sellPrice: 120000, score: 60.0, wattage: 300,
    flavor: 'Fictional quantum memory. Stores data in superposition.',
    levelRequired: 35,
    lore: 'Each address in QR-1 contains two values simultaneously. The CPU sees the correct one. Nobody knows how.',
    specs: { capacity: '4TB', speed: '80000MHz', type: 'Quantum DDR' }
  },
  infinite_cache: {
    id: 'infinite_cache', name: '∞ Cache Module', category: 'ram', tier: 'mythic',
    price: 999999, sellPrice: 599999, score: 120.0, wattage: 999,
    flavor: 'Theoretical. Contains all possible data. Does not fit in any known socket.',
    levelRequired: 35,
    lore: 'The ∞ Cache Module was theorized in a 1975 paper and achieved in 2031. Physically it resembles a very confident flash drive.',
    specs: { capacity: '∞', speed: '∞', type: '∞' }
  },

  // ==================== STORAGE ====================
  sata_500gb: {
    id: 'sata_500gb', name: '500GB SATA SSD', category: 'storage', tier: 'budget',
    price: 35, sellPrice: 21, score: 0.5, wattage: 3,
    flavor: 'Functional. Gets the job done. Nothing more.',
    levelRequired: 0,
    specs: { capacity: '500GB', speed: '550MB/s', type: 'SATA' }
  },
  sata_1tb: {
    id: 'sata_1tb', name: '1TB SATA SSD', category: 'storage', tier: 'budget',
    price: 65, sellPrice: 39, score: 0.8, wattage: 4,
    flavor: 'A terabyte for $65. The future is now.',
    levelRequired: 0,
    specs: { capacity: '1TB', speed: '550MB/s', type: 'SATA' }
  },
  nvme_1tb_gen4: {
    id: 'nvme_1tb_gen4', name: '1TB NVMe PCIe 4.0', category: 'storage', tier: 'midrange',
    price: 89, sellPrice: 53, score: 2.0, wattage: 6,
    flavor: '7000MB/s. Games load before you sit down.',
    levelRequired: 0,
    specs: { capacity: '1TB', speed: '7000MB/s', type: 'NVMe Gen4' }
  },
  nvme_2tb_gen4: {
    id: 'nvme_2tb_gen4', name: '2TB NVMe PCIe 4.0', category: 'storage', tier: 'midrange',
    price: 149, sellPrice: 89, score: 2.8, wattage: 8,
    flavor: 'Two terabytes. Now you have room for your Steam backlog AND games you\'ll play.',
    levelRequired: 0,
    specs: { capacity: '2TB', speed: '7000MB/s', type: 'NVMe Gen4' }
  },
  nvme_2tb_gen5: {
    id: 'nvme_2tb_gen5', name: '2TB NVMe PCIe 5.0', category: 'storage', tier: 'highend',
    price: 249, sellPrice: 149, score: 4.0, wattage: 12,
    flavor: '14000MB/s. Thermal throttles sometimes. Worth it.',
    levelRequired: 5,
    specs: { capacity: '2TB', speed: '14000MB/s', type: 'NVMe Gen5' }
  },
  nvme_4tb_gen5: {
    id: 'nvme_4tb_gen5', name: '4TB NVMe PCIe 5.0', category: 'storage', tier: 'highend',
    price: 449, sellPrice: 269, score: 5.0, wattage: 15,
    flavor: 'Four terabytes of Gen5 speed. Install everything.',
    levelRequired: 5,
    specs: { capacity: '4TB', speed: '14000MB/s', type: 'NVMe Gen5' }
  },
  nvme_8tb_gen5: {
    id: 'nvme_8tb_gen5', name: '8TB NVMe PCIe 5.0', category: 'storage', tier: 'exotic',
    price: 999, sellPrice: 599, score: 6.5, wattage: 18,
    flavor: 'Eight terabytes. Your entire life fits on this.',
    levelRequired: 12,
    specs: { capacity: '8TB', speed: '14000MB/s', type: 'NVMe Gen5' }
  },
  optane_4tb: {
    id: 'optane_4tb', name: '4TB Intel Optane P5920', category: 'storage', tier: 'exotic',
    price: 2200, sellPrice: 1320, score: 8.0, wattage: 14,
    flavor: 'Latency-optimized. Every microsecond counts here.',
    levelRequired: 12,
    specs: { capacity: '4TB', speed: '7500MB/s', type: 'Optane', latency: 'ultra-low' }
  },
  nvme_gen6_16tb: {
    id: 'nvme_gen6_16tb', name: '16TB NVMe PCIe 6.0', category: 'storage', tier: 'legendary',
    price: 8000, sellPrice: 4800, score: 12.0, wattage: 25,
    flavor: 'Fictional Gen6. Sixteen terabytes at 30,000MB/s. The OS loads in 0.1s.',
    levelRequired: 22,
    lore: 'PCIe 6.0 doesn\'t exist yet in consumer form. This drive was sourced from a place we don\'t talk about. It\'s fast.',
    specs: { capacity: '16TB', speed: '30000MB/s', type: 'NVMe Gen6' }
  },
  holo_100tb: {
    id: 'holo_100tb', name: '100TB Holographic Drive', category: 'storage', tier: 'legendary',
    price: 25000, sellPrice: 15000, score: 18.0, wattage: 30,
    flavor: 'Holographic storage. Instant. All of it.',
    levelRequired: 22,
    lore: 'Encodes data as holographic patterns in a crystalline substrate. Access time is effectively zero. It projects a small hologram of itself when idle.',
    specs: { capacity: '100TB', speed: 'instant', type: 'Holographic' }
  },
  quantum_storage: {
    id: 'quantum_storage', name: '1PB Quantum SSD', category: 'storage', tier: 'mythic',
    price: 500000, sellPrice: 300000, score: 50.0, wattage: 100,
    flavor: 'One petabyte. Fictional quantum storage. Contains multitudes.',
    levelRequired: 35,
    lore: 'Each bit is stored as a quantum state. You cannot observe whether any specific file exists until you look at it. Then it definitely exists.',
    specs: { capacity: '1PB', speed: '∞', type: 'Quantum SSD' }
  },

  // ==================== PSUs ====================
  psu_500w_bronze: {
    id: 'psu_500w_bronze', name: '500W Bronze PSU', category: 'psu', tier: 'budget',
    price: 45, sellPrice: 27, score: 1.0, wattage: 500,
    flavor: 'Pray it doesn\'t pop. It\'s thinking about it.',
    levelRequired: 0,
    specs: { wattage: 500, efficiency: '80+ Bronze', modular: false }
  },
  psu_650w_gold: {
    id: 'psu_650w_gold', name: '650W Gold PSU', category: 'psu', tier: 'midrange',
    price: 89, sellPrice: 53, score: 2.0, wattage: 650,
    flavor: 'Reliable. Gold efficiency. Hums contentedly.',
    levelRequired: 0,
    specs: { wattage: 650, efficiency: '80+ Gold', modular: true }
  },
  psu_750w_gold: {
    id: 'psu_750w_gold', name: '750W Gold PSU', category: 'psu', tier: 'midrange',
    price: 109, sellPrice: 65, score: 2.5, wattage: 750,
    flavor: 'Standard issue. Nothing to worry about here.',
    levelRequired: 0,
    specs: { wattage: 750, efficiency: '80+ Gold', modular: true }
  },
  psu_850w_gold: {
    id: 'psu_850w_gold', name: '850W Gold PSU', category: 'psu', tier: 'midrange',
    price: 139, sellPrice: 83, score: 3.0, wattage: 850,
    flavor: 'Headroom to spare. OC without fear.',
    levelRequired: 0,
    specs: { wattage: 850, efficiency: '80+ Gold', modular: true }
  },
  psu_1000w_plat: {
    id: 'psu_1000w_plat', name: '1000W Platinum PSU', category: 'psu', tier: 'highend',
    price: 189, sellPrice: 113, score: 4.0, wattage: 1000,
    flavor: 'Four figures of wattage. Platinum efficiency. You\'re set.',
    levelRequired: 5,
    specs: { wattage: 1000, efficiency: '80+ Platinum', modular: true }
  },
  psu_1200w_plat: {
    id: 'psu_1200w_plat', name: '1200W Platinum PSU', category: 'psu', tier: 'highend',
    price: 249, sellPrice: 149, score: 5.0, wattage: 1200,
    flavor: '1200 watts. Dual-GPU setups welcome.',
    levelRequired: 5,
    specs: { wattage: 1200, efficiency: '80+ Platinum', modular: true }
  },
  psu_1600w_titan: {
    id: 'psu_1600w_titan', name: '1600W Titanium PSU', category: 'psu', tier: 'exotic',
    price: 449, sellPrice: 269, score: 6.5, wattage: 1600,
    flavor: 'Titanium efficiency. Powers your rig and your ambitions.',
    levelRequired: 12,
    specs: { wattage: 1600, efficiency: '80+ Titanium', modular: true }
  },
  psu_2000w_titan: {
    id: 'psu_2000w_titan', name: '2000W Titanium PSU', category: 'psu', tier: 'exotic',
    price: 699, sellPrice: 419, score: 8.0, wattage: 2000,
    flavor: 'Two kilowatts. Your electricity bill noticed.',
    levelRequired: 12,
    specs: { wattage: 2000, efficiency: '80+ Titanium', modular: true }
  },
  psu_3000w_exotic: {
    id: 'psu_3000w_exotic', name: '3000W HyperCell PSU', category: 'psu', tier: 'exotic',
    price: 1800, sellPrice: 1080, score: 10.0, wattage: 3000,
    flavor: 'Fictional. Three kilowatts. The circuit breaker is shaking.',
    levelRequired: 12,
    lore: 'The HyperCell uses a proprietary cell chemistry that probably isn\'t legal in all jurisdictions. Powers three rigs simultaneously.',
    specs: { wattage: 3000, efficiency: '80+ HyperCell', modular: true }
  },
  psu_5000w_quantum: {
    id: 'psu_5000w_quantum', name: '5000W Quantum Cell PSU', category: 'psu', tier: 'legendary',
    price: 6000, sellPrice: 3600, score: 14.0, wattage: 5000,
    flavor: 'Fictional reactor-grade power supply. Has its own fan RPM display.',
    levelRequired: 22,
    lore: 'The Quantum Cell uses a miniaturized fusion loop to generate power. Technically classifies as a power plant in three US states.',
    specs: { wattage: 5000, efficiency: '99%+', modular: true }
  },
  psu_reactor: {
    id: 'psu_reactor', name: '20000W Fusion Reactor PSU', category: 'psu', tier: 'mythic',
    price: 80000, sellPrice: 48000, score: 30.0, wattage: 20000,
    flavor: 'Actually a micro-reactor. Read the datasheet before installing.',
    levelRequired: 35,
    lore: 'Listed under "PSU" for tax purposes. Actually a Gen IV micro-reactor licensed from a defense contractor. Ships with a 3-inch thick lead manual.',
    specs: { wattage: 20000, efficiency: '~99.9%', modular: true, coolant: 'heavy water' }
  },

  // ==================== MOTHERBOARDS ====================
  mobo_b550: {
    id: 'mobo_b550', name: 'ASUS Prime B550M', category: 'motherboard', tier: 'budget',
    price: 89, sellPrice: 53, score: 1.0, wattage: 15,
    flavor: 'Budget AM4. Does the job. Minimal frills.',
    levelRequired: 0,
    specs: { socket: 'AM4', formFactor: 'mATX', pcie: 'PCIe 4.0' }
  },
  mobo_b650: {
    id: 'mobo_b650', name: 'MSI B650 Tomahawk', category: 'motherboard', tier: 'midrange',
    price: 179, sellPrice: 107, score: 2.5, wattage: 20,
    flavor: 'AM5 entry point. Tomahawk never misses.',
    levelRequired: 0,
    specs: { socket: 'AM5', formFactor: 'ATX', pcie: 'PCIe 5.0' }
  },
  mobo_z790: {
    id: 'mobo_z790', name: 'ASUS ROG Strix Z790-E', category: 'motherboard', tier: 'highend',
    price: 449, sellPrice: 269, score: 4.0, wattage: 30,
    flavor: 'ROG logo glows. Feels good. Overclocks great.',
    levelRequired: 5,
    specs: { socket: 'LGA1700', formFactor: 'ATX', pcie: 'PCIe 5.0' }
  },
  mobo_x670e: {
    id: 'mobo_x670e', name: 'ASUS ROG Crosshair X670E', category: 'motherboard', tier: 'highend',
    price: 599, sellPrice: 359, score: 4.5, wattage: 35,
    flavor: 'AM5 flagship. Crosshair legacy lives on.',
    levelRequired: 5,
    specs: { socket: 'AM5', formFactor: 'ATX', pcie: 'PCIe 5.0' }
  },
  mobo_trx50: {
    id: 'mobo_trx50', name: 'ASUS Pro WS TRX50', category: 'motherboard', tier: 'exotic',
    price: 1299, sellPrice: 779, score: 7.0, wattage: 50,
    flavor: 'Threadripper board. Large. Intimidating. Perfect.',
    levelRequired: 12,
    specs: { socket: 'sTR5', formFactor: 'EATX', pcie: 'PCIe 5.0 ×8' }
  },
  mobo_w790: {
    id: 'mobo_w790', name: 'Intel W790 Domino Ridge', category: 'motherboard', tier: 'exotic',
    price: 1099, sellPrice: 659, score: 6.5, wattage: 45,
    flavor: 'Xeon platform board. Engineered for the enterprise.',
    levelRequired: 12,
    specs: { socket: 'LGA4677', formFactor: 'EATX', pcie: 'PCIe 5.0' }
  },
  mobo_nexus: {
    id: 'mobo_nexus', name: 'PCForge NexusBoard X1', category: 'motherboard', tier: 'legendary',
    price: 4500, sellPrice: 2700, score: 12.0, wattage: 80,
    flavor: 'Fictional universal socket board. Fits every CPU ever made.',
    levelRequired: 22,
    lore: 'PCForge\'s proprietary Universal-1 socket supports every CPU ever manufactured via an adaptive contact array. Patent pending in 7 countries.',
    specs: { socket: 'Universal-1', formFactor: 'EATX', pcie: 'PCIe 6.0' }
  },
  mobo_quantum: {
    id: 'mobo_quantum', name: 'QuantumBoard QX', category: 'motherboard', tier: 'mythic',
    price: 50000, sellPrice: 30000, score: 30.0, wattage: 200,
    flavor: 'Fictional quantum interconnect board. The traces are made of light.',
    levelRequired: 35,
    lore: 'The QX replaces copper traces with photon conduits. The PCB is transparent. The BOM is classified.',
    specs: { socket: 'QuantumSocket', formFactor: 'HEATX', pcie: 'PCIe ∞' }
  },

  // ==================== COOLING ====================
  stock_cooler: {
    id: 'stock_cooler', name: 'Stock Box Cooler', category: 'cooling', tier: 'budget',
    price: 0, sellPrice: 0, score: 0.25, wattage: 5,
    flavor: 'Loud. Suffering. Still spinning. Somehow.',
    levelRequired: 0,
    specs: { type: 'Air', tdp: '65W', noise: 'yes' }
  },
  cooler_budget_tower: {
    id: 'cooler_budget_tower', name: 'Arctic Freezer 36', category: 'cooling', tier: 'budget',
    price: 39, sellPrice: 23, score: 1.5, wattage: 5,
    flavor: 'Solid budget air. Arctic knows what they\'re doing.',
    levelRequired: 0,
    specs: { type: 'Air', tdp: '120W', noise: 'low' }
  },
  cooler_noctua_u12: {
    id: 'cooler_noctua_u12', name: 'Noctua NH-U12S', category: 'cooling', tier: 'midrange',
    price: 79, sellPrice: 47, score: 2.5, wattage: 7,
    flavor: 'Whisper quiet. Brown and beige. Legendary reliability.',
    levelRequired: 0,
    specs: { type: 'Air', tdp: '180W', noise: 'whisper' }
  },
  cooler_noctua_d15: {
    id: 'cooler_noctua_d15', name: 'Noctua NH-D15', category: 'cooling', tier: 'highend',
    price: 99, sellPrice: 59, score: 3.5, wattage: 8,
    flavor: 'The OG tower king. Still the best air cooler in 2025.',
    levelRequired: 5,
    specs: { type: 'Air', tdp: '250W', noise: 'barely audible' }
  },
  cooler_240aio: {
    id: 'cooler_240aio', name: 'Corsair H100i 240mm AIO', category: 'cooling', tier: 'midrange',
    price: 109, sellPrice: 65, score: 3.0, wattage: 10,
    flavor: 'All-in-one liquid. Glows pretty. Cools better.',
    levelRequired: 0,
    specs: { type: 'AIO Liquid', radiator: '240mm', tdp: '200W' }
  },
  cooler_360aio: {
    id: 'cooler_360aio', name: 'Corsair H170i 360mm AIO', category: 'cooling', tier: 'highend',
    price: 179, sellPrice: 107, score: 4.5, wattage: 15,
    flavor: '360mm radiator. The flagship Corsair build essential.',
    levelRequired: 5,
    specs: { type: 'AIO Liquid', radiator: '360mm', tdp: '350W' }
  },
  cooler_custom_loop: {
    id: 'cooler_custom_loop', name: 'Custom Hardline Loop', category: 'cooling', tier: 'exotic',
    price: 799, sellPrice: 479, score: 7.0, wattage: 25,
    flavor: 'Bring your own plumber. Worth every drop.',
    levelRequired: 12,
    lore: 'Bent copper pipes. Reservoir with dye. Full system loop. You either know what this is or you\'re about to learn.',
    specs: { type: 'Custom Loop', tdp: '600W', noise: 'near silent' }
  },
  cooler_ln2_kit: {
    id: 'cooler_ln2_kit', name: 'Liquid Nitrogen Sub-Zero Kit', category: 'cooling', tier: 'exotic',
    price: 2500, sellPrice: 1500, score: 10.0, wattage: 0,
    flavor: 'Required for some legendaries. Also cools your drink.',
    levelRequired: 12,
    lore: 'LN2 (-196°C) poured directly over your chip. The cold bug is real. The madness is realer. For competitive overclockers and mild pyromaniacs.',
    specs: { type: 'LN2', tdp: '1000W+', temp: '-196°C' }
  },
  cooler_cryo_phase: {
    id: 'cooler_cryo_phase', name: 'Phase-Change Cryo Unit', category: 'cooling', tier: 'legendary',
    price: 8000, sellPrice: 4800, score: 14.0, wattage: 800,
    flavor: 'Fictional. Phase-change cooling at scale. Like a fridge for your CPU.',
    levelRequired: 22,
    lore: 'A miniature refrigerator cycle attached directly to your IHS. Maintains -50°C year-round. The compressor is louder than your GPU fan.',
    specs: { type: 'Phase-Change', tdp: '1500W', temp: '-50°C' }
  },
  cooler_quantum_sink: {
    id: 'cooler_quantum_sink', name: 'Quantum Heat Dissipator', category: 'cooling', tier: 'mythic',
    price: 45000, sellPrice: 27000, score: 28.0, wattage: 500,
    flavor: 'Fictional zero-point cooling. Moves heat into the void.',
    levelRequired: 35,
    lore: 'The QHD displaces thermal energy into a localized zero-point energy field. In layman\'s terms: it puts heat somewhere else. Nobody knows where.',
    specs: { type: 'Quantum', tdp: '∞', temp: '0K' }
  },

  // ==================== CASES ====================
  case_budget: {
    id: 'case_budget', name: 'Generic ATX Case', category: 'case', tier: 'budget',
    price: 29, sellPrice: 17, score: 0.5, wattage: 0,
    flavor: 'Airflow? Never heard of it.',
    levelRequired: 0,
    specs: { formFactor: 'ATX', psuShroud: false, rgbFans: 0 }
  },
  case_nzxt_h5: {
    id: 'case_nzxt_h5', name: 'NZXT H5 Flow', category: 'case', tier: 'midrange',
    price: 99, sellPrice: 59, score: 2.0, wattage: 0,
    flavor: 'Clean aesthetic. NZXT does it again.',
    levelRequired: 0,
    specs: { formFactor: 'ATX', psuShroud: true, rgbFans: 2 }
  },
  case_fractal: {
    id: 'case_fractal', name: 'Fractal Torrent', category: 'case', tier: 'highend',
    price: 189, sellPrice: 113, score: 3.5, wattage: 0,
    flavor: 'Airflow king. Fractal earns its reputation.',
    levelRequired: 5,
    specs: { formFactor: 'ATX', psuShroud: true, rgbFans: 2, frontFans: '2×180mm' }
  },
  case_lian_li: {
    id: 'case_lian_li', name: 'Lian Li O11 Dynamic EVO', category: 'case', tier: 'highend',
    price: 169, sellPrice: 101, score: 3.5, wattage: 0,
    flavor: 'RGB showcase. Your rig looks like a nightclub.',
    levelRequired: 5,
    specs: { formFactor: 'ATX/EATX', psuShroud: true, rgbFans: 3 }
  },
  case_caselabs: {
    id: 'case_caselabs', name: 'CaseLabs Magnum THW10', category: 'case', tier: 'exotic',
    price: 599, sellPrice: 359, score: 5.0, wattage: 0,
    flavor: 'Massive. You could live in it.',
    levelRequired: 12,
    lore: 'A collector\'s item since CaseLabs closed. The THW10 is large enough to store a small pet. Airflow is irrelevant at this size.',
    specs: { formFactor: 'Full Tower', psuShroud: true, dual_loop: true }
  },
  case_open_bench: {
    id: 'case_open_bench', name: 'Open Benching Frame', category: 'case', tier: 'exotic',
    price: 299, sellPrice: 179, score: 4.0, wattage: 0,
    flavor: 'No thermals. All chaos. Excellent desk ornament.',
    levelRequired: 12,
    specs: { formFactor: 'Open Frame', thermals: 'ambient', rgbFans: 0 }
  },
  case_server_rack: {
    id: 'case_server_rack', name: '4U Server Rack Chassis', category: 'case', tier: 'exotic',
    price: 899, sellPrice: 539, score: 6.0, wattage: 0,
    flavor: 'Industrial. Goes in a rack. Loud. Powerful. Intimidating.',
    levelRequired: 12,
    specs: { formFactor: '4U Rack', fans: '6×80mm', rails: true }
  },
  case_titanium: {
    id: 'case_titanium', name: 'TitanForge Obsidian Case', category: 'case', tier: 'legendary',
    price: 3500, sellPrice: 2100, score: 9.0, wattage: 0,
    flavor: 'Solid titanium. Fictional. Indestructible. Heavy.',
    levelRequired: 22,
    lore: 'Milled from a single block of aerospace-grade titanium. The TitanForge Obsidian weighs 42kg. It will outlast your components, your house, and possibly you.',
    specs: { formFactor: 'Full Tower', material: 'Titanium alloy', weight: '42kg' }
  },
  case_singularity: {
    id: 'case_singularity', name: 'Singularity Void Case', category: 'case', tier: 'mythic',
    price: 25000, sellPrice: 15000, score: 20.0, wattage: 0,
    flavor: 'Pocket dimension interior. Fits unlimited parts. Weighs nothing.',
    levelRequired: 35,
    lore: 'The Void Case occupies 3U of physical space but contains a pocket dimension with unlimited internal volume. Components installed inside report "vibes" as excellent. Nobody has opened it since.',
    specs: { formFactor: 'Void', interior: '∞', weight: '0g (exterior)' }
  }
};

export const CATEGORIES = ['cpu', 'gpu', 'ram', 'storage', 'psu', 'motherboard', 'cooling', 'case'];

export function getPartsByCategory(category) {
  return Object.values(parts).filter(p => p.category === category);
}

export function getPartById(id) {
  return parts[id] || null;
}
