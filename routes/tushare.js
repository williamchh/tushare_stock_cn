const express = require("express");
const router = express.Router();
const {
  getStockData,
  processData,
} = require("../middleware/tushareMiddleware");

router.get("/", getStockData, processData, (req, res) => {
  res.json(req.codes);
});

module.exports = router;
