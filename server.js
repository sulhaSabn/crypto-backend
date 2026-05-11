const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./auth"); // مسیر ثبت‌نام و ورود
const User = require("./User");       // مدل کاربر

const app = express();

// 📌 Middleware
app.use(cors());
app.use(express.json());

// 📌 اتصال به دیتابیس
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.error("MongoDB error ❌", err));

// 📌 مسیرهای اصلی
app.use("/auth", authRoutes);

// 📌 مسیر کیف پول (نمایش موجودی و آدرس)
app.get("/wallet/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
    res.json({ balance: user.balance, walletAddress: "TDE8mMioHzXWff1bKfsVpc32AcnWrufPrB" });
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت کیف پول" });
  }
});

// 📌 مسیر خرید
app.post("/trade/buy", async (req, res) => {
  try {
    const { email, symbol, amount } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });

    user.balance -= amount; // کم کردن موجودی
    await user.save();

    res.json({ message: `خرید ${symbol} به مبلغ ${amount} انجام شد`, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "خطا در خرید" });
  }
});

// 📌 مسیر فروش
app.post("/trade/sell", async (req, res) => {
  try {
    const { email, symbol, amount } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });

    user.balance += amount; // اضافه کردن موجودی
    await user.save();

    res.json({ message: `فروش ${symbol} به مبلغ ${amount} انجام شد`, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "خطا در فروش" });
  }
});

// 📌 مسیر قیمت‌ها (۵ ارز برتر)
app.get("/prices/top", async (req, res) => {
  try {
    // نمونه‌ی تستی (می‌توانی بعداً به Binance API وصل کنی)
    const prices = [
      { symbol: "BTCUSDT", price: 65000 },
      { symbol: "ETHUSDT", price: 3200 },
      { symbol: "BNBUSDT", price: 500 },
      { symbol: "XRPUSDT", price: 0.55 },
      { symbol: "ADAUSDT", price: 0.45 }
    ];
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت قیمت‌ها" });
  }
});

// 📌 اجرای سرور
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
