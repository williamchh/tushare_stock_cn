const express = require("express");
const router = express.Router();

const Candle = require("../models/Candle");
const StockListItem = require("../models/StockListItem");
const {
  getStockDataAll,
  processData,
  getIndicators,
} = require("../middleware/tushareMiddleware");

router.get("/", getStockDataAll, processData, getIndicators, (req, res) => {
  let stocks = req.stock.finalStock;
  stocks.values = stocks.values.slice(0, 1199);
  stocks.updateDate = new Date(req.stock.latestDate);
  const candle = new Candle(stocks);

  const item = {
    code: stocks.code,
    latestUpdate: stocks.updateDate
  };
  let stockItem = new StockListItem(item);

  
  stockItem.save();
  candle.save();
  // let candle = req.codes;
  // candle.sa
  res.send("stock saved");
});

module.exports = router;
