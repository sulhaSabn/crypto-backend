const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/top", async (req,res)=>{
  try {
    const symbols = ["BTCUSDT","ETHUSDT","BNBUSDT","XRPUSDT","ADAUSDT"];
    let prices = [];
    for(let s of symbols){
      const r = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`);
      prices.push({ symbol:s, price:r.data.price });
    }
    res.json(prices);
  } catch(err){
    res.json({ error:"خطا در دریافت قیمت‌ها" });
  }
});

module.exports = router;