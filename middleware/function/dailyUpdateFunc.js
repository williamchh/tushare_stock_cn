const StockListItem = require("../../models/StockListItem");
const Candle = require("../../models/Candle");
const { calculateIndicators } = require("./calculateIndicators");
const {
  dateString,
  getWeekNumber,
  getMonthNumber,
  weeksInYear,
} = require("./dateUtils");
const {
  getNewWeekObject,
  getNewMonthObject,
  updateMonthObject,
  updateWeekObject,
  combineHourly,
  combineCandleValuesWithIndicators,
  addHourly,
} = require("./dataProcess");
const { getNodeText } = require("@testing-library/react");

var self = (module.exports = {
  combineDbWithHstArr: (stock_db, hstArr) => {
    let c = [];
    stock_db.forEach((stock) => {
      hstArr.forEach((hst) => {
        if (hst.code === stock.code) {
          c.push({
            ...stock,
            hst: hst.hst,
          });
        }
      });
    });
    return c;
  },
  updateArrStocks: async (stock_ts, stock_db, hstArr) => {
    const ts = self.groupByCode(stock_ts);

    let res = [];

    stock_db = self.combineDbWithHstArr(stock_db, hstArr);

    stock_db.forEach((stock) => {
      // find the latest update data
      const latestDate = stock.values[0].daily.date;

      // todo iterate ts array
      ts.forEach((tushare) => {
        // find the same stock code
        // update them
        if (tushare.code === stock.code) {
          console.log(stock.code);
          const s = self.updateSingleStockWithDailyActivity(
            stock,
            tushare,
            latestDate
          );
          //    const { stockValue, weekMonth } = ;
          res.push(self.getIndicators(s));
        }
      });
    });

    // update to mongo db
    await self.updateToDb(res);

    return res;
  },

  updateToDb: async (res) => {
    res.forEach(async (result) => {
      const { stockValue, weekMonth } = result;
      const sv = {
        code: stockValue.code,
        updateDate: new Date().toISOString(),
        values: stockValue.values,
      };

      const listItem = {
        code: stockValue.code,
        latestUpdate: new Date().toISOString(),
        week: weekMonth.week,
        month: weekMonth.month,
      };

      const stockFilter = { code: sv.code };
      // let stock = await Candle.findOneAndUpdate(stockFilter, sv);

      let item = await StockListItem.findOneAndUpdate(stockFilter, listItem);
      console.log(item);
      // const stock = new Candle(sv);
      // const stockListItem = new StockListItem(listItem);

      // stock.update();
      // stockListItem.save();

      // console.log(result);
    });
  },

  groupByCode: (stock_ts) => {
    let ts = [];
    stock_ts.forEach((stock) => {
      const index = self.isStockInArr(ts, stock);
      if (index === -1) {
        ts.push({
          code: stock[0],
          values: [stock],
        });
      } else {
        ts[index].values.push(stock);
      }
    });
    return ts;
  },

  isStockInArr: (ts, stock) => {
    const len = ts.length;
    if (len === 0) return -1;

    let is = -1;
    let cnt = 0;
    while (cnt < len) {
      if (ts[cnt].code === stock[0]) return cnt;
      cnt++;
    }
    return is;
  },

  ///
  /// OVERRIDE stock values data
  ///

  updateSingleStockWithDailyActivity: (stock, tushare, latestDate) => {
    let stockStartIndex = findStartIndex(stock, latestDate) - 1;
    let valuesNew = [];

    // let hr = stock.values[stockStartIndex].hourly;
    // let day = stock.values[stockStartIndex].daily;
    let week = stock.values[stockStartIndex].weekly;
    let month = stock.values[stockStartIndex].monthly;
    let cpWk = getWeekNumber(stock.values[stockStartIndex].daily.date);
    let cpMn = getMonthNumber(stock.values[stockStartIndex].daily.date);
    // slice tushare set
    const ts = tushare.values.filter((t) => t[1] >= latestDate);
    if (ts.length > 0) {
      // stock.values = [];

      ts.reverse();
      ts.forEach((item) => {
        const itemWk = getWeekNumber(item[1]);
        const itemMn = getMonthNumber(item[1]);

        if (itemWk[0] !== cpWk[0] || itemWk[1] !== cpWk[1]) {
          cpWk = itemWk;
          week = getNewWeekObject(item);
        } else {
          week = updateWeekObject(item, week);
        }

        if (itemMn[0] !== cpMn[0] || itemMn[1] !== cpMn[1]) {
          cpMn = itemMn;
          month = getNewMonthObject(item);
        } else {
          month = updateMonthObject(item, month);
        }

        // add hourly value set into item which only contain daily value set in 'item'
        const hour = addHourly(item);
        let value = combineHourly(hour, week, month, item);
        value.values = value.values.reverse();

        // console.log(value);
        valuesNew = value.values.concat(valuesNew);
      });
    }

    // extract stock.values to new arr for backup purpose
    const backupArr = stock.values;
    // override stock.values => append new hourly candle
    stock.values = [];
    stock.values = valuesNew;

    let c = stockStartIndex + 1;
    stockStartIndex = stock.values.length - 1;

    while (c < backupArr.length) {
      stock.values[stock.values.length] = backupArr[c];
      c++;
    }
    return { stock, stockStartIndex };
  },

  getIndicators: (value) => {
    const { stock, stockStartIndex } = value;
    // let stocks = [stock];

    let combinedDataSet = calculateIndicators([stock], stockStartIndex);

    return combineCandleValuesWithIndicators(stock, combinedDataSet);
  },
  dataFromDbCombineWithWeekMonth: (stock_db, arr) => {
    const len = stock_db.length;
    let cnt = 0;
    while (cnt < len) {
      arr.forEach((a) => {
        if (a.ts_code == stock_db[cnt].code) {
          stock_db[cnt] = {
            ...stock_db[cnt],
            week: a.week,
            month: a.month,
          };
        }
      });

      cnt++;
    }
    return stock_db;
  },
});

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
