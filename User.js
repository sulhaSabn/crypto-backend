const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  }, // وضعیت تأیید ایمیل
  referralCode: { 
    type: String, 
    unique: true 
  }, // کد رفرال اختصاصی
  referredBy: { 
    type: String, 
    default: null 
  }, // کد رفرال دعوت‌کننده
  balance: { 
    type: Number, 
    default: 0 
  }, // موجودی USDT
  referrals: [{ 
    type: String 
  }], // لیست ایمیل‌های دعوت‌شده
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// جلوگیری از خطاهای unique در ثبت‌نام‌های متعدد
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ referralCode: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
