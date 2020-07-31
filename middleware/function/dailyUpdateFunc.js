const StockListItem = require("../../models/StockListItem")
const Candle = require("../../models/Candle");
const { calculateIndicators } = require("./calculateIndicators")
const { dateString, getWeekNumber, getMonthNumber, weeksInYear } = require("./dateUtils")
const { getNewWeekObject, 
        getNewMonthObject, 
        updateMonthObject, 
        updateWeekObject, 
        combineHourly,
        combineCandleValuesWithIndicators,
        addHourly} = require("./dataProcess");
const { getNodeText } = require("@testing-library/react");

var self = module.exports = {
    updateArrStocks: (stock_ts, stock_db) => {
        const ts = self.groupByCode(stock_ts);

        let res = [];
        
        stock_db.forEach(stock => {
            // find the latest update data
            const latestDate = stock.values[0].daily.date;

            
            // todo iterate ts array
            ts.forEach(tushare => {
                // find the same stock code
                // update them
                if (tushare.code === stock.code) {
                   const s = self.updateSingleStockWithDailyActivity(stock, tushare, latestDate);
                //    const { stockValue, weekMonth } = ;
                   res.push(self.getIndicators(s));
                }
            });


        });
        return res;
    },
  
    groupByCode: (stock_ts) => {
        let ts = [];
        stock_ts.forEach(stock => {
            const index = self.isStockInArr(ts, stock)
            if (index === -1) {
                ts.push({
                    code: stock[0],
                    values:[stock]
                });
            }
            else {
                ts[index].values.push(stock)
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

  
        const stockStartIndex = findStartIndex(stock, latestDate) - 1;
        let valuesNew = [];
        
        // let hr = stock.values[stockStartIndex].hourly;
        // let day = stock.values[stockStartIndex].daily;
        let week = stock.values[stockStartIndex].weekly;
        let month = stock.values[stockStartIndex].monthly;
        let cpWk = getWeekNumber(stock.values[stockStartIndex].daily.date);
        let cpMn = getMonthNumber(stock.values[stockStartIndex].daily.date);
        // slice tushare set
        const ts = tushare.values.filter(t => t[1] >= latestDate);
        if (ts.length > 0) {
            
            // stock.values = [];

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
                valuesNew = valuesNew.concat(value.values);
                
            })
        }
        let c = 0;
        while (c <= stockStartIndex) {
            stock.values[c] = valuesNew[c];
            c++;
        }
        return {stock, stockStartIndex};
    },
    
    getIndicators: (value) => {
        
        const { stock, stockStartIndex } = value;
        let stocks = [stock];
       

        let combinedDataSet = calculateIndicators(stocks, stockStartIndex);

        return combineCandleValuesWithIndicators(stocks[0], combinedDataSet);
          
    },
    dataFromDbCombineWithWeekMonth: (stock_db, arr) => {
        const len = stock_db.length;
        let cnt = 0;
        while (cnt < len) {
            arr.forEach(a => {
                if (a.ts_code == stock_db[cnt].code) {
                    stock_db[cnt] = {
                        ...stock_db[cnt],
                        week: a.week,
                        month: a.month
                    }
                }
            })

            cnt++;
        }
        return stock_db;
    }
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