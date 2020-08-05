const axios = require("axios");
const StockListItem = require("../models/StockListItem");
const Candle = require("../models/Candle");

const {
  updateArrStocks,
  dataFromDbCombineWithWeekMonth,
} = require("./function/dailyUpdateFunc");
const { tushareDate } = require("./function/dateUtils");
const {
  groupByNum,
  arrGetDatesAndCodes,
  getOldestDate,
} = require("./function/arrayUtils");
const { config, paramsWithDate } = require("./function/tushareUtils");
//
//
//
module.exports = {
  getStockListItems: async (req, res, next) => {
    const listItems = await StockListItem.find({}).lean();
    let updateItems = [];
    const dateNow = Date.now();

    listItems.map((item) => {
      const diffTime = Math.abs(dateNow - item.latestUpdate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        updateItems.push({
          ts_code: item.code,
          start_date: tushareDate(item.latestUpdate),
          end_date: tushareDate(new Date()),
          week: item.week,
          month: item.month,
        });
      }
    });

    req.updateItems = {};
    req.updateItems.stockValue = [];
    req.updateItems.items = updateItems;
    next();
  },
  groupUpdateStock: async (req, res, next) => {
    const data = req.updateItems.items;
    var n = 2;
    var updateArr = groupByNum(data, n);
    let len = updateArr.length;
    // let hstArr = [];

    updateArr.forEach(async (arr) => {
      let stock_db = [];
      let stock_ts = [];

      // get smallest date
      // get all ts-code => put into arr
      const { date, ts_code } = arrGetDatesAndCodes(arr);
      const oldestDate = getOldestDate(date);

      // TODO call db
      // TODO call tushare
      try {
        stock_db = await Candle.find({ code: { $in: ts_code } }).lean();
        const res = await axios.post(
          "https://api.waditu.com",
          paramsWithDate(ts_code, oldestDate, tushareDate(new Date())),
          config()
        );
        stock_db = dataFromDbCombineWithWeekMonth(stock_db, arr);
        stock_ts = res.data.data.items;

        // hstArr = hstArr.concat(getHstDataArr(stock_db));

        // hstArr = updateHstArrWithTushareData(hstArr, stock_ts);

        req.updateItems.stockValue = req.updateItems.stockValue.concat(
          updateArrStocks(stock_ts, stock_db)
        );

        len--;
        if (len === 0) {
          next();
        }
      } catch (error) {
        res.send(error.message);
      }
    });

    // const codes = req.header("ts-code")
    //                 .split(",")
    //                 .map(Function.prototype.call, String.prototype.trim);

    // next();
  },
};
