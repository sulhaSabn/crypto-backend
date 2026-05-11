const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();

router.post("/register", async (req,res)=>{
  const { email, password } = req.body;
  const exist = await User.findOne({ email });
  if(exist) return res.json({ error:"ایمیل قبلاً ثبت شده است" });
  const hash = await bcrypt.hash(password,10);
  const user = new User({ email, password:hash });
  await user.save();
  res.json({ message:"ثبت‌نام موفقیت‌آمیز بود" });
});

router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error:"کاربر یافت نشد" });
  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.json({ error:"رمز عبور اشتباه است" });
  const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:"1d" });
  res.json({ token, balance:user.balance });
});

module.exports = router;