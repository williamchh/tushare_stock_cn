const axios = require("axios")
const StockListItem = require("../models/StockListItem")
const Candle = require("../models/Candle");

const { updateArrStocks } = require("./function/dailyUpdateFunc")
const { tushareDate } = require("./function/dateUtils")
const { groupByNum, arrGetDatesAndCodes, getOldestDate } = require("../middleware/function/arrayUtils")
const { config, paramsWithDate} = require("../middleware/function/tushareUtils")
module.exports = {
    getStockListItems: async (req, res, next) => {
        const listItems = await StockListItem.find({});
        let updateItems = [];
        const dateNow = Date.now();

        listItems.map(item => {
            const diffTime = Math.abs(dateNow - item.latestUpdate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                
                
                updateItems.push({
                    ts_code: item.code,
                    start_date: tushareDate(item.latestUpdate),
                    end_date: tushareDate(new Date)
                });
            }
        })

        req.updateItems = {};
        req.updateItems.items = updateItems;
        next();
    },
    groupUpdateStock: async (req, res, next) => {
        const data = req.updateItems.items;
        var n = 5;
        var updateArr = groupByNum(data, n);

        updateArr.forEach(async arr => {
            let stock_db = [];
            let stock_ts = [];
            
            // get smallest date
            // get all ts-code => put into arr
            const { date, ts_code } = arrGetDatesAndCodes(arr)
            const oldestDate = getOldestDate(date);

            
            // TODO call db
            // TODO call tushare
            try {
                stock_db = await Candle.find({"code": {$in:ts_code}}).lean()
                const res = await axios.post(
                    "https://api.waditu.com",
                    paramsWithDate(ts_code, oldestDate, tushareDate(new Date)),
                    config()
                );
                stock_ts = res.data.data.items;

                updateArrStocks(stock_ts, stock_db);
            } catch (error) {
                res.send(error.message)
            }
        })

        // const codes = req.header("ts-code")
        //                 .split(",")
        //                 .map(Function.prototype.call, String.prototype.trim);
       

        next();
    }
}