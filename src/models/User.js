import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  profileImage: {
    type: String,
    default: ''
  },

  // Subscription fields
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free'
  },
  tokensImages: {
    type: Number,
    default: 10
  },
  tokensText: {
    type: Number,
    default: 3
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'inactive', 'past_due'],
    default: 'inactive'
  },
  subscriptionId: {
    type: String,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: null
  },
  resetDate: {
    type: Date,
    default: function () {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Reset tokens method
UserSchema.methods.resetTokens = function () {
  if (this.plan === 'free') {
    this.tokensImages = 10;
    this.tokensText = 3;
  } else if (this.plan === 'basic') {
    this.tokensImages = 300;
    this.tokensText = 100;
  } else if (this.plan === 'pro') {
    this.tokensImages = -1; // -1 means unlimited
    this.tokensText = -1;
  }

  const now = new Date();
  this.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

// Check if tokens need reset
UserSchema.methods.checkAndResetTokens = function () {
  const now = new Date();
  if (now >= this.resetDate && this.plan !== 'pro') {
    this.resetTokens();
    return true;
  }
  return false;
};

// Deduct tokens
UserSchema.methods.deductToken = function (type) {
  if (this.plan === 'pro') {
    return true; // Pro has unlimited
  }

  if (type === 'image') {
    if (this.tokensImages > 0) {
      this.tokensImages -= 1;
      return true;
    }
  } else if (type === 'text') {
    if (this.tokensText > 0) {
      this.tokensText -= 1;
      return true;
    }
  }
  return false;
};

// Check if has tokens
UserSchema.methods.hasTokens = function (type) {
  if (this.plan === 'pro') {
    return true;
  }

  if (type === 'image') {
    return this.tokensImages > 0;
  } else if (type === 'text') {
    return this.tokensText > 0;
  }
  return false;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);