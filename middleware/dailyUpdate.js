// const axios = require("axios")
const StockListItem = require("../models/StockListItem")

const { tushareDate } = require("./function/dateUtils")
const { groupByNum } = require("../middleware/function/arrayUtils")

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
        var n = 2;
        var updateArr = groupByNum(data, n);

        updateArr.map(arr => {
            // TODO get smallest date

            // TODO get all ts-code => put into arr

            // TODO call tushare

            // TODO call db
        })

        try {
            const codes = req.header("ts-code")
                            .split(",")
                            .map(Function.prototype.call, String.prototype.trim);
            
            var stock = await Candle.find({"code":{$in:codes}})
            // var stock = await Candle.find({})
        
            res.json(stock);
            
        } catch (error) {
            res.send(error.response)
        }

        next();
    }
}