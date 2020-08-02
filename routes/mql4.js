const express = require("express");

const router = express.Router();

const Candle = require("../models/Candle");

router.get("/", async (req, res) => {
  let stocks = await Candle.find({}).lean();
  stocks.forEach((stock) => {
    delete stock._id;
    delete stock.updateDate;
    delete stock.__v;
    stock.values.forEach((value) => {
      delete value._id;
      delete value.hourly.nextSum08;
      delete value.hourly.nextSum13;
      delete value.hourly.nextSum21;
      delete value.daily.nextSum08;
      delete value.daily.nextSum13;
      delete value.daily.nextSum21;
      delete value.weekly.nextSum08;
      delete value.weekly.nextSum13;
      delete value.weekly.nextSum21;
      delete value.monthly.nextSum08;
      delete value.monthly.nextSum13;
      delete value.monthly.nextSum21;
    });
  });
  res.json(stocks);
});

module.exports = router;
