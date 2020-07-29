const express = require("express");
const router = express.Router();

const Candle = require("../models/Candle");
const {
  getStockDataAll,
  processData,
  getIndicators,
} = require("../middleware/tushareMiddleware");

router.get("/", getStockDataAll, processData, getIndicators, (req, res) => {
  let stocks = req.stock.finalStock;
  stocks.values = stocks.values.slice(0, 1199);
  const candle = new Candle(stocks);
  
  candle.save();
  // let candle = req.codes;
  // candle.sa
  res.send("stock saved");
});

module.exports = router;
