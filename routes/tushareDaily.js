const express = require('express')
const router = express.Router();

const Candle = require("../models/Candle")

router.get("/", async (req, res) => {
    try {
        const stock = await Candle.findOne({ code: "600000.SH"});
    
        res.json(stock);
        
    } catch (error) {
        res.send(error.response)
    }
})

module.exports = router;