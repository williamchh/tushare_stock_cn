const express = require("express");
const router = express.Router();

const Candle = require("../models/Candle");
const {
  getStockDataAll,
  processData,
  getIndicators,
} = require("../middleware/tushareMiddleware");

router.get("/", getStockDataAll, processData, getIndicators, (req, res) => {
  const stocks = req.codes;
  stocks.map((stock) => {
    const candle = new Candle(stock);
    candle.save();
  });
  // let candle = req.codes;
  // candle.sa
  res.json(req.codes);
});

module.exports = router;
