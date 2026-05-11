const express = require("express");
const User = require("./User");

const router = express.Router();

router.post("/deposit", async (req,res)=>{
  const { email, amount } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error:"کاربر یافت نشد" });
  user.balance += amount;
  await user.save();
  res.json({ message:"واریز انجام شد", balance:user.balance });
});

router.post("/withdraw", async (req,res)=>{
  const { email, amount } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error:"کاربر یافت نشد" });
  if(user.balance < amount) return res.json({ error:"موجودی کافی نیست" });
  user.balance -= amount;
  await user.save();
  res.json({ message:"برداشت انجام شد", balance:user.balance });
});

module.exports = router;