const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User.js");

const router = express.Router();

// 📌 ثبت‌نام
router.post("/register", async (req, res) => {
  try {
    const { email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "ایمیل و رمز عبور الزامی است" });
    }

    // بررسی وجود کاربر
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: "ایمیل قبلاً ثبت شده است" });
    }

    // هش کردن رمز عبور
    const hash = await bcrypt.hash(password, 10);

    // ساخت کد رفرال اختصاصی
    const myReferral = Math.random().toString(36).substring(2, 8);

    // ایجاد کاربر جدید
    const user = new User({
      email,
      password: hash,
      referralCode: myReferral,
      referredBy: referralCode || null
    });

    await user.save();

    // 📌 اگر کاربر با رفرال ثبت‌نام کرده باشد، به دعوت‌کننده ۰.۵٪ سود اضافه شود
    if (referralCode) {
      const inviter = await User.findOne({ referralCode });
      if (inviter) {
        const bonus = inviter.balance * 0.005; // ۰.۵٪
        inviter.balance += bonus;
        await inviter.save();
      }
    }

    res.json({ message: "ثبت‌نام موفقیت‌آمیز بود", referralCode: myReferral });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "خطا در ثبت‌نام" });
  }
});

// 📌 ورود
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "ایمیل و رمز عبور الزامی است" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "رمز عبور اشتباه است" });
    }

    // ساخت توکن JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      balance: user.balance,
      referralCode: user.referralCode
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "خطا در ورود" });
  }
});

module.exports = router;
