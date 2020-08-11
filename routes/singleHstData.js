const express = require("express");
const router = express.Router();

const {
  getStockDataAll,
  getStockData,
  processData,
} = require("../middleware/tushareMiddleware");

const {
  ToSinaHourlyCollection,
  ToSinaDailyCollection,
} = require("../middleware/singleHstDataMiddleware");

router.get("/daily", getStockDataAll, ToSinaDailyCollection, (req, res) => {
  const stocks = req.stock.days;

  res.json(stocks);
});

router.get(
  "/hourly",
  getStockData,
  processData,
  ToSinaHourlyCollection,
  (req, res) => {
    const values = req.stock.hours;

    res.json(values);
  }
);

module.exports = router;
