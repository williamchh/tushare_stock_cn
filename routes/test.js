const express = require("express");
const router = express.Router();
const TestItem = require("../models/TestItem");
// const { getWeekNumber } = require("../middleware/function/dateUtils")

router.post("/", (req, res) => {
  const testItem = new TestItem({
    code: "600000.SH",
    latest: new Date().toISOString(),
  });
  testItem.save();

  const item2 = new TestItem({
    code: "000001.SZ",
    latest: new Date().toISOString(),
  });
  item2.save();
  res.send("ok");
});

router.get("/", async (req, res) => {
  const items = await TestItem.find({});

  res.json(items);
});

router.put("/", async (req, res) => {
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  const filter = { code: "000001.SZ" };
  const update = { latest: new Date().addDays(4) };
  let itemNew = await TestItem.findOneAndUpdate(filter, update, (a) => {
    console.log(a);
  });
  res.json(itemNew);
});

module.exports = router;
