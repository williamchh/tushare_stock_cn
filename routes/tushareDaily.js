const express = require('express')
const router = express.Router();

const { getStockListItems, groupUpdateStock } = require("../middleware/dailyUpdate")

// const Candle = require("../models/Candle");
// const StockListItem = require("../models/StockListItem")


router.get("/", getStockListItems, groupUpdateStock, (req, res) => {
    const stocks = req.updateItems;
    
    res.send("ok")
})

module.exports = router;