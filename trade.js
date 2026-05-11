const express = require("express");
const User = require("./User");

const router = express.Router();

router.post("/buy", async (req,res)=>{
  const { email, symbol, amount } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error:"کاربر یافت نشد" });
  user.balance -= amount;
  await user.save();
  res.json({ message:`خرید ${symbol} انجام شد`, balance:user.balance });
});

router.post("/sell", async (req,res)=>{
  const { email, symbol, amount } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error:"کاربر یافت نشد" });
  user.balance += amount;
  await user.save();
  res.json({ message:`فروش ${symbol} انجام شد`, balance:user.balance });
});

module.exports = router;