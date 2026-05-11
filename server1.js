const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// اتصال به دیتابیس
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>console.log("MongoDB connected ✅"))
  .catch(err=>console.error("MongoDB error:", err));

// مسیرها
app.use("/auth", require("./auth"));
app.use("/wallet", require("./wallet"));
app.use("/trade", require("./trade"));
app.use("/prices", require("./prices"));

app.get("/", (req,res)=>res.send("Backend is running ✅"));

// پورت برای Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));