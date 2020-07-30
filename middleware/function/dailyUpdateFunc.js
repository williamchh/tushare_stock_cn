const StockListItem = require("../../models/StockListItem")
const Candle = require("../../models/Candle");
const { dateString, getWeekNumber, getMonthNumber, weeksInYear } = require("./dateUtils")
const { getNewWeekObject, 
        getNewMonthObject, 
        updateMonthObject, 
        updateWeekObject, 
        combineHourly,
        combineCandleValuesWithIndicators,
        addHourly} = require("./dataProcess");
const { hasInArray } = require("./arrayUtils")        
const { getNodeText } = require("@testing-library/react");

var self = module.exports = {
    updateArrStocks: (stock_ts, stock_db) => {
        const ts = self.groupByCode(stock_ts);
        
        stock_db.forEach(stock => {
            // find the latest update data
            const latestDate = stock.values[0].daily.date;

            
            // todo iterate ts array
            ts.forEach(tushare => {
                // find the same stock code
                // update them
                if (tushare.code === stock.code) {
                   const s = self.updateSingleStockWithDailyActivity(stock, tushare, latestDate);
                   self.getIndicators(s);
                }
            })
        });
    },
    // groupMongoDoc: (stock_db) => {
    //     let db = [];
    //     stock_db.forEach(stock => 
    //         db.push(new Candle(stock))
    //     );
    //     return db;
    // },
    groupByCode: (stock_ts) => {
        let ts = [];
        stock_ts.forEach(stock => {
            const index = self.isStockInArr(ts, stock)
            if (index === -1) {
                ts.push({
                    code: stock[0],
                    values:[stock]
                    // values: [{
                    //     date: stock[1],
                    //     open: stock[2],
                    //     high: stock[3],
                    //     low: stock[4],
                    //     close: stock[5]
                    // }]
                });
            }
            else {
                ts[index].values.push(
                    stock
                //     {
                //     date: stock[1],
                //     open: stock[2],
                //     high: stock[3],
                //     low: stock[4],
                //     close: stock[5]
                // }
                )
            }
        });
        return ts;
    },

    isStockInArr : (ts, stock) => {
        const len = ts.length;
        if (len === 0)  return -1;
        
        let is = -1;
        let cnt = 0;
        while (cnt < len) {
            if (ts[cnt].code === stock[0])  return cnt;
            cnt++;
        }
        return is;
    },
    updateSingleStockWithDailyActivity: (stock, tushare, latestDate) => {

        const updatedIndex = findStartIndex(stock, latestDate);
        const previousValue = stock.values[updatedIndex];
        const stockStartIndex = updatedIndex - 1;
        
        // let hr = stock.values[stockStartIndex].hourly;
        // let day = stock.values[stockStartIndex].daily;
        let week = stock.values[stockStartIndex].weekly;
        let month = stock.values[stockStartIndex].monthly;
        let cpWk = getWeekNumber(stock.values[stockStartIndex].daily.date);
        let cpMn = getMonthNumber(stock.values[stockStartIndex].daily.date);
        // slice tushare set
        const ts = sliceTushareSet(tushare, latestDate);
        if (ts.length > 0) {
            
            stock.values = [];

            ts.reverse();
            ts.forEach(item => {
                const itemWk = getWeekNumber(item[1]);
                const itemMn = getMonthNumber(item[1]);
    
                if (itemWk[0] !== cpWk[0] || itemWk[1] !== cpWk[1]) {
                    cpWk = itemWk;
                    week = getNewWeekObject(item);
                }
                else {
                    week = updateWeekObject(item, week);
                }
    
                if (itemMn[0] !== cpMn[0] || itemMn[1] !== cpMn[1]) {
                    cpMn = itemMn;
                    month = getNewMonthObject(item);
                } 
                else {
                    month = updateMonthObject(item, month);
                }

                // add hourly value set into item which only contain daily value set in 'item'
                const hour = addHourly(item);
                let value = combineHourly(hour, week, month, item);
                value.values = value.values.reverse();
    
                console.log(value);
                stock.values = value.values;
    
            })
        }

        return {stock, previousValue};
    },
    
    getIndicators: (value) => {
        
        const { stocks, previousValue } = value;
        // let stocks = stock;
        let hours = [];
        let days = [];
        let weeks = [];
        let months = [];
        let dy = [];
        let we = [];
        let mt = [];


        stocks.values.map((value) => {
            const { hourly, daily, weekly, monthly } = value;
            // const weighted = (hourly.high + hourly.low + hourly.close * 2) / 4.0;
            let has = false;
            has = hasInArray(daily, dy);
            if (!has) {
            dy.push(daily.date);
            days.push(daily.close);
            }

            has = false;
            has = hasInArray(weekly, we);
            if (!has) {
            we.push(weekly.date);
            weeks.push(weekly.close);
            }

            has = false;
            has = hasInArray(monthly, mt);
            if (!has) {
            mt.push(monthly.date);
            months.push(monthly.close);
            }

            hours.push(hourly.close); 
        });
        



        const smaHourly08 = sma(8, hours);
        const smaHourly13 = sma(13, hours);
        const smaHourly21 = sma(21, hours);

        const smaDaily08 = sma(8, days);
        const smaDaily13 = sma(13, days);
        const smaDaily21 = sma(21, days);

        const smaWeekly08 = sma(8, weeks);
        const smaWeekly13 = sma(13, weeks);
        const smaWeekly21 = sma(21, weeks);

        const smaMonthly08 = sma(8, months);
        const smaMonthly13 = sma(13, months);
        const smaMonthly21 = sma(21, months);

        const macdHourly = macd(21, 34, 8, hours);
        const macdDaily = macd(21, 34, 8, days);
        const macdWeekly = macd(21, 34, 8, weeks);
        const macdMonthly = macd(21, 34, 8, months);

        const bandHourly = bands(21, 1.618, hours, smaHourly21.sma);
        const bandDaily = bands(21, 1.618, days, smaDaily21.sma);
        const bandWeekly = bands(21, 1.618, weeks, smaWeekly21.sma);
        const bandMonthly = bands(21, 1.618, months, smaMonthly21.sma);

        let combinedDataSet = {
        smaHourly08, smaHourly13, smaHourly21,
        smaDaily08, smaDaily13, smaDaily21,
        smaWeekly08, smaWeekly13, smaWeekly21,
        smaMonthly08, smaMonthly13, smaMonthly21,
        macdHourly, macdDaily, macdWeekly, macdMonthly,
        bandHourly, bandDaily, bandWeekly, bandMonthly,
        dy, we, mt
        };

        req.stock.finalStock = combineCandleValuesWithIndicators(stocks[0], combinedDataSet);
        
        console.log(smaHourly08.sma.length);
        // console.log(ema08.length)

    
  
    }
}

function sliceTushareSet(tushare, latestDate) {
    return tushare.values.filter(t => t[1] >= latestDate);
}

function findStartIndex(stock, latestDate) {
    let sta = 0;
    while (sta < stock.values.length) {
        if (stock.values[sta].daily.date !== latestDate) {
            return sta;
        }
        sta++;
    }
    return sta;
}