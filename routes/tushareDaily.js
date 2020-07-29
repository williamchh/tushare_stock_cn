const express = require('express')
const router = express.Router();

const { getStockData } = require("../middleware/tushareMiddleware")
const { getStockListItems, groupUpdateStock } = require("../middleware/dailyUpdate")

const Candle = require("../models/Candle");
const StockListItem = require("../models/StockListItem")

//  getStockData,
router.get("/", getStockListItems, groupUpdateStock, async (req, res) => {
    res.send("ok")
})

module.exports = router;