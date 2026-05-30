// models/Player.js
import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  username: String,
  wallet: { type: Number, default: 500 },
  bank: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  prestige: { type: Number, default: 0 },
  karmaPoints: { type: Number, default: 0 },
  scavengeLastUsed: Date,
  totalLifetimeEarned: { type: Number, default: 0 },
  inventory: [
    {
      partId: String,
      wear: { type: Number, default: 0 },
      acquired: { type: Date, default: Date.now }
    }
  ],
  pcs: [
    {
      slot: Number,
      name: String,
      built: { type: Boolean, default: false },
      parts: {
        cpu: String,
        gpu: String,
        ram: String,
        storage: String,
        psu: String,
        motherboard: String,
        cooling: String,
        case: String
      },
      task: { type: String, default: 'idle' },
      taskStarted: Date,
      lastCollected: { type: Date, default: Date.now },
      totalEarned: { type: Number, default: 0 },
      wear: {
        cpu: { type: Number, default: 0 },
        gpu: { type: Number, default: 0 },
        ram: { type: Number, default: 0 },
        storage: { type: Number, default: 0 },
        psu: { type: Number, default: 0 },
        cooling: { type: Number, default: 0 }
      },
      online: { type: Boolean, default: true },
      offlineUntil: Date,
      activeBoost: {
        type: String,
        expiresAt: Date,
        multiplier: Number
      }
    }
  ],
  activeEvent: {
    eventId: String,
    expiresAt: Date
  },
  unlockedTasks: [String],
  prestigeShopPurchases: [String],
  settings: {
    dmNotifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Auto-init 4 PC slots
PlayerSchema.pre('save', function (next) {
  if (this.isNew) {
    for (let i = 1; i <= 4; i++) {
      if (!this.pcs.find(p => p.slot === i)) {
        this.pcs.push({ slot: i, name: `PC Slot ${i}`, built: false });
      }
    }
  }
  next();
});

export default mongoose.model('Player', PlayerSchema);
