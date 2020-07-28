const express = require("express");
const router = express.Router();

const { getWeekNumber } = require("../middleware/function/dateUtils")

router.post("/", (req, res) => {
    const d = getWeekNumber(req.body.d)
    // console.log(weeksInYear(req.body.y))
    console.log(d)
    res.send(d)
})

module.exports = router;