const express = require("express");
const router = express.Router();

const Candle = require("../models/Candle");
const StockListItem = require("../models/StockListItem");
const {
  getStockDataAll,
  getStockData,
  processHourly,
  processData,
  getIndicators,
} = require("../middleware/tushareMiddleware");

router.get("/group", getStockData, processHourly, (req, res) => {
  res.json(req.stock.hour);
});
router.get("/", getStockDataAll, processData, getIndicators, (req, res) => {
  let stocks = req.stock.finalStock;
  const { week, month } = req.stock.weekMonth;
  stocks.values = stocks.values.slice(0, 1199);
  stocks.updateDate = new Date(req.stock.latestDate);
  const candle = new Candle(stocks);

  const item = {
    code: stocks.code,
    latestUpdate: stocks.updateDate,
    week,
    month,
  };
  let stockItem = new StockListItem(item);

  stockItem.save();
  candle.save();
  // let candle = req.codes;
  // candle.sa
  res.send("stock saved");
});

module.exports = router;
