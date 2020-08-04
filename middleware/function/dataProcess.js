const { getWeekNumber, getMonthNumber } = require("./dateUtils");
const { isEqual } = require("./setUtils");

var self = (module.exports = {
  getHstDataArr: (stock_db) => {
    let stocks = [];

    stock_db.forEach((stock) => {
      let days = [];
      let weeks = [];
      let months = [];
      days.push({
        date: stock.values[0].daily.date,
        value: stock.values[0].daily,
      });
      weeks.push({
        date: stock.values[0].weekly.date,
        value: stock.values[0].weekly,
      });
      months.push({
        date: stock.values[0].monthly.date,
        value: stock.values[0].monthly,
      });

      stock.values.forEach((value) => {
        if (value.daily.date !== days[days.length - 1].date) {
          days.push({ date: value.daily.date, value: value.daily });
        }
        if (value.weekly.date !== weeks[weeks.length - 1].date) {
          weeks.push({ date: value.weekly.date, value: value.weekly });
        }
        if (value.monthly.date !== months[months.length - 1].date) {
          months.push({ date: value.monthly.date, value: value.monthly });
        }
      });

      stocks.push({
        code: stock.code,
        hst: {
          days,
          weeks,
          months,
        },
      });
    });
    return stocks;
  },

  updateStockDBWithTushareData: (stock_db, ts) => {
    Set.prototype.addObj = function (obj) {
      var set = new Set(this.valueOf());

      let has = false;
      set.forEach((s) => {
        if (isEqual(s, obj)) has = true;
      });

      if (!has) {
        set.add(obj);
      }
      return { set, has };
    };
    let stock = ts;
    let wk = new Set();
    let mn = new Set();
    stock.forEach((s) => {
      for (let i = 0; i < stock_db.length; i++) {
        const element = stock_db[i];

        if (s.code === element.code) {
          s.values.reverse().forEach((v) => {
            //
            // add new values include hourly, daily, weekly, monthly
            //
            if (v[1] > stock_db[i].values[0].daily.date) {
              var hrs = self.addHourly(v);
              var w = self.getNewWeekObject(v);
              var m = self.getNewMonthObject(v);
              const { values } = self.combineHourly(hrs, w, m, v);
              values.reverse();
              stock_db[i].values = values.concat(stock_db[i].values);
              // console.log(hrs);
            }

            //
            // add new week cache
            //
            if (v[1] > stock_db[i].week[0].date) {
              const newDate = getWeekNumber(v[1]);
              const oldDate = getWeekNumber(stock_db[i].week[0].date);
              if (newDate[0] > oldDate[0]) {
                const { set, has } = wk.addObj({
                  code: stock_db[i].code,
                  date: v[1],
                  value: v[5],
                });
                wk = set;
                if (!has) stock_db[i].week.unshift({ date: v[1], value: v[5] });
              } else if (newDate[0] === oldDate[0] && newDate[1] > oldDate[1]) {
                const { set, has } = wk.addObj({
                  code: stock_db[i].code,
                  date: v[1],
                  value: v[5],
                });
                wk = set;
                if (!has) stock_db[i].week.unshift({ date: v[1], value: v[5] });
              }
            }

            //
            // add new month cache
            //
            if (v[1] > stock_db[i].month[0].date) {
              const newDate = getMonthNumber(v[1]);
              const oldDate = getMonthNumber(stock_db[i].month[0].date);
              if (newDate[0] > oldDate[0]) {
                const { set, has } = mn.addObj({
                  code: stock_db[i].code,
                  date: v[1],
                  value: v[5],
                });
                mn = set;
                if (!has)
                  stock_db[i].month.unshift({ date: v[1], value: v[5] });
              } else if (newDate[0] === oldDate[0] && newDate[1] > oldDate[1]) {
                const { set, has } = mn.addObj({
                  code: stock_db[i].code,
                  date: v[1],
                  value: v[5],
                });
                mn = set;
                if (!has)
                  stock_db[i].month.unshift({ date: v[1], value: v[5] });
              }
            }
          });
        }
      }
    });

    return stock_db;
  },
  combineCandleValuesWithIndicators: (stock, combinedDataSet) => {
    const {
      smaHourly08,
      smaHourly13,
      smaHourly21,
      smaDaily08,
      smaDaily13,
      smaDaily21,
      smaWeekly08,
      smaWeekly13,
      smaWeekly21,
      smaMonthly08,
      smaMonthly13,
      smaMonthly21,
      macdHourly,
      macdDaily,
      macdWeekly,
      macdMonthly,
      bandHourly,
      bandDaily,
      bandWeekly,
      bandMonthly,
      dy,
      we,
      mt,
      weekValue,
      monthValue,
    } = combinedDataSet;

    const len = stock.values.length;
    let cnt = 0;
    let cntDay = 0;
    let cntWeek = 0;
    let cntMonth = 0;
    while (cnt < len) {
      const value = stock.values[cnt];

      // hourly
      stock.values[cnt].hourly.macd = parseFloat(macdHourly.macd[cnt]);
      stock.values[cnt].hourly.signal = parseFloat(macdHourly.signal[cnt]);
      stock.values[cnt].hourly.ema21 = parseFloat(macdHourly.ema21[cnt]);
      stock.values[cnt].hourly.ema34 = parseFloat(macdHourly.ema34[cnt]);
      stock.values[cnt].hourly.stddv = parseFloat(bandHourly.stddev[cnt]);
      stock.values[cnt].hourly.upper = parseFloat(bandHourly.upperBand[cnt]);
      stock.values[cnt].hourly.lower = parseFloat(bandHourly.lowerBand[cnt]);
      stock.values[cnt].hourly.sma08 = parseFloat(smaHourly08.sma[cnt]);
      stock.values[cnt].hourly.sma13 = parseFloat(smaHourly13.sma[cnt]);
      stock.values[cnt].hourly.sma21 = parseFloat(smaHourly21.sma[cnt]);
      stock.values[cnt].hourly.nextSum08 = parseFloat(smaHourly08.nextSum[cnt]);
      stock.values[cnt].hourly.nextSum13 = parseFloat(smaHourly13.nextSum[cnt]);
      stock.values[cnt].hourly.nextSum21 = parseFloat(smaHourly21.nextSum[cnt]);

      // daily
      if (value.daily.date === dy[cntDay]) {
        stock.values[cnt].daily.macd = parseFloat(macdDaily.macd[cntDay]);
        stock.values[cnt].daily.signal = parseFloat(macdDaily.signal[cntDay]);
        stock.values[cnt].daily.ema21 = parseFloat(macdDaily.ema21[cntDay]);
        stock.values[cnt].daily.ema34 = parseFloat(macdDaily.ema34[cntDay]);
        stock.values[cnt].daily.stddv = parseFloat(bandDaily.stddev[cntDay]);

        stock.values[cnt].daily.upper = parseFloat(bandDaily.upperBand[cntDay]);
        stock.values[cnt].daily.lower = parseFloat(bandDaily.lowerBand[cntDay]);

        stock.values[cnt].daily.sma08 = parseFloat(smaDaily08.sma[cntDay]);
        stock.values[cnt].daily.sma13 = parseFloat(smaDaily13.sma[cntDay]);
        stock.values[cnt].daily.sma21 = parseFloat(smaDaily21.sma[cntDay]);
        stock.values[cnt].daily.nextSum08 = parseFloat(smaDaily08.nextSum[cnt]);
        stock.values[cnt].daily.nextSum13 = parseFloat(smaDaily13.nextSum[cnt]);
        stock.values[cnt].daily.nextSum21 = parseFloat(smaDaily21.nextSum[cnt]);

        if (isNaN(stock.values[cnt].daily.nextSum08))
          stock.values[cnt].daily.nextSum08 =
            stock.values[cnt - 1].daily.nextSum08;
        if (isNaN(stock.values[cnt].daily.nextSum13))
          stock.values[cnt].daily.nextSum13 =
            stock.values[cnt - 1].daily.nextSum13;
        if (isNaN(stock.values[cnt].daily.nextSum21))
          stock.values[cnt].daily.nextSum21 =
            stock.values[cnt - 1].daily.nextSum21;
      } else {
        cntDay++;
        stock.values[cnt].daily.macd = parseFloat(macdDaily.macd[cntDay]);
        stock.values[cnt].daily.signal = parseFloat(macdDaily.signal[cntDay]);
        stock.values[cnt].daily.ema21 = parseFloat(macdDaily.ema21[cntDay]);
        stock.values[cnt].daily.ema34 = parseFloat(macdDaily.ema34[cntDay]);
        stock.values[cnt].daily.stddv = parseFloat(bandDaily.stddev[cntDay]);
        stock.values[cnt].daily.upper = parseFloat(bandDaily.upperBand[cntDay]);
        stock.values[cnt].daily.lower = parseFloat(bandDaily.lowerBand[cntDay]);
        stock.values[cnt].daily.sma08 = parseFloat(smaDaily08.sma[cntDay]);
        stock.values[cnt].daily.sma13 = parseFloat(smaDaily13.sma[cntDay]);
        stock.values[cnt].daily.sma21 = parseFloat(smaDaily21.sma[cntDay]);
        stock.values[cnt].daily.nextSum08 = parseFloat(smaDaily08.nextSum[cnt]);
        stock.values[cnt].daily.nextSum13 = parseFloat(smaDaily13.nextSum[cnt]);
        stock.values[cnt].daily.nextSum21 = parseFloat(smaDaily21.nextSum[cnt]);

        if (isNaN(stock.values[cnt].daily.nextSum08))
          stock.values[cnt].daily.nextSum08 =
            stock.values[cnt - 1].daily.nextSum08;
        if (isNaN(stock.values[cnt].daily.nextSum13))
          stock.values[cnt].daily.nextSum13 =
            stock.values[cnt - 1].daily.nextSum13;
        if (isNaN(stock.values[cnt].daily.nextSum21))
          stock.values[cnt].daily.nextSum21 =
            stock.values[cnt - 1].daily.nextSum21;
      }

      // weekly;
      // if (cnt === 0 && value.weekly.date > we[cntWeek]) {
      //   we.unshift(value.weekly.date);
      // }
      if (value.weekly.date === we[cntWeek]) {
        stock.values[cnt].weekly.macd = parseFloat(macdWeekly.macd[cntWeek]);
        stock.values[cnt].weekly.signal = parseFloat(
          macdWeekly.signal[cntWeek]
        );
        stock.values[cnt].weekly.ema21 = parseFloat(macdWeekly.ema21[cntWeek]);
        stock.values[cnt].weekly.ema34 = parseFloat(macdWeekly.ema34[cntWeek]);
        stock.values[cnt].weekly.stddv = parseFloat(bandWeekly.stddev[cntWeek]);
        stock.values[cnt].weekly.upper = parseFloat(
          bandWeekly.upperBand[cntWeek]
        );
        stock.values[cnt].weekly.lower = parseFloat(
          bandWeekly.lowerBand[cntWeek]
        );

        stock.values[cnt].weekly.sma08 = parseFloat(smaWeekly08.sma[cntWeek]);
        stock.values[cnt].weekly.sma13 = parseFloat(smaWeekly13.sma[cntWeek]);
        stock.values[cnt].weekly.sma21 = parseFloat(smaWeekly21.sma[cntWeek]);
        stock.values[cnt].weekly.nextSum08 = parseFloat(
          smaWeekly08.nextSum[cntWeek]
        );
        stock.values[cnt].weekly.nextSum13 = parseFloat(
          smaWeekly13.nextSum[cntWeek]
        );
        stock.values[cnt].weekly.nextSum21 = parseFloat(
          smaWeekly21.nextSum[cntWeek]
        );
      } else {
        cntWeek++;
        stock.values[cnt].weekly.macd = parseFloat(macdWeekly.macd[cntWeek]);
        stock.values[cnt].weekly.signal = parseFloat(
          macdWeekly.signal[cntWeek]
        );
        stock.values[cnt].weekly.ema21 = parseFloat(macdWeekly.ema21[cntWeek]);
        stock.values[cnt].weekly.ema34 = parseFloat(macdWeekly.ema34[cntWeek]);
        stock.values[cnt].weekly.stddv = parseFloat(bandWeekly.stddev[cntWeek]);
        stock.values[cnt].weekly.upper = parseFloat(
          bandWeekly.upperBand[cntWeek]
        );
        stock.values[cnt].weekly.lower = parseFloat(
          bandWeekly.lowerBand[cntWeek]
        );
        stock.values[cnt].weekly.sma08 = parseFloat(smaWeekly08.sma[cntWeek]);
        stock.values[cnt].weekly.sma13 = parseFloat(smaWeekly13.sma[cntWeek]);
        stock.values[cnt].weekly.sma21 = parseFloat(smaWeekly21.sma[cntWeek]);
        stock.values[cnt].weekly.nextSum08 = parseFloat(
          smaWeekly08.nextSum[cntWeek]
        );
        stock.values[cnt].weekly.nextSum13 = parseFloat(
          smaWeekly13.nextSum[cntWeek]
        );
        stock.values[cnt].weekly.nextSum21 = parseFloat(
          smaWeekly21.nextSum[cntWeek]
        );
      }

      // Month
      // if (cnt === 0 && value.monthly.date > mt[cntMonth]) {
      //   mt.unshift(value.monthly.date);
      // }
      if (value.monthly.date === mt[cntMonth]) {
        stock.values[cnt].monthly.macd = parseFloat(macdMonthly.macd[cntMonth]);
        stock.values[cnt].monthly.signal = parseFloat(
          macdMonthly.signal[cntMonth]
        );
        stock.values[cnt].monthly.ema21 = parseFloat(
          macdMonthly.ema21[cntMonth]
        );
        stock.values[cnt].monthly.ema34 = parseFloat(
          macdMonthly.ema34[cntMonth]
        );
        stock.values[cnt].monthly.stddv = parseFloat(
          bandMonthly.stddev[cntMonth]
        );
        stock.values[cnt].monthly.upper = parseFloat(
          bandMonthly.upperBand[cntMonth]
        );
        stock.values[cnt].monthly.lower = parseFloat(
          bandMonthly.lowerBand[cntMonth]
        );

        stock.values[cnt].monthly.sma08 = parseFloat(
          smaMonthly08.sma[cntMonth]
        );
        stock.values[cnt].monthly.sma13 = parseFloat(
          smaMonthly13.sma[cntMonth]
        );
        stock.values[cnt].monthly.sma21 = parseFloat(
          smaMonthly21.sma[cntMonth]
        );
        stock.values[cnt].monthly.nextSum08 = parseFloat(
          smaMonthly08.nextSum[cntMonth]
        );
        stock.values[cnt].monthly.nextSum13 = parseFloat(
          smaMonthly13.nextSum[cntMonth]
        );
        stock.values[cnt].monthly.nextSum21 = parseFloat(
          smaMonthly21.nextSum[cntMonth]
        );
      } else {
        cntMonth++;
        stock.values[cnt].monthly.macd = parseFloat(macdMonthly.macd[cntMonth]);
        stock.values[cnt].monthly.signal = parseFloat(
          macdMonthly.signal[cntMonth]
        );
        stock.values[cnt].monthly.ema21 = parseFloat(
          macdMonthly.ema21[cntMonth]
        );
        stock.values[cnt].monthly.ema34 = parseFloat(
          macdMonthly.ema34[cntMonth]
        );
        stock.values[cnt].monthly.stddv = parseFloat(
          bandMonthly.stddev[cntMonth]
        );
        stock.values[cnt].monthly.upper = parseFloat(
          bandMonthly.upperBand[cntMonth]
        );
        stock.values[cnt].monthly.lower = parseFloat(
          bandMonthly.lowerBand[cntMonth]
        );
        stock.values[cnt].monthly.sma08 = parseFloat(
          smaMonthly08.sma[cntMonth]
        );
        stock.values[cnt].monthly.sma13 = parseFloat(
          smaMonthly13.sma[cntMonth]
        );
        stock.values[cnt].monthly.sma21 = parseFloat(
          smaMonthly21.sma[cntMonth]
        );
        stock.values[cnt].monthly.nextSum08 = parseFloat(
          smaMonthly08.nextSum[cntMonth]
        );
        stock.values[cnt].monthly.nextSum13 = parseFloat(
          smaMonthly13.nextSum[cntMonth]
        );
        stock.values[cnt].monthly.nextSum21 = parseFloat(
          smaMonthly21.nextSum[cntMonth]
        );
      }
      if (isNaN(stock.values[cnt].monthly.nextSum21)) {
        console.log(cnt);
      }

      cnt++;
    }

    const weekMonth = {
      week: weekValue,
      month: monthValue,
    };

    return { stockValue: stock, weekMonth };
  },

  getNewWeekObject: (item) => {
    return {
      date: item[1],
      open: item[2],
      high: item[3],
      low: item[4],
      close: item[5],
      sma08: 0,
      sma13: 0,
      sma21: 0,
      ema21: 0,
      ema34: 0,
      macd: 0,
      signal: 0,
      stddv: 0,
      upper: 0,
      lower: 0,
    };
  },
  getNewMonthObject: (item) => {
    return {
      date: item[1],
      open: item[2],
      high: item[3],
      low: item[4],
      close: item[5],
      sma08: 0,
      sma13: 0,
      sma21: 0,
      ema21: 0,
      ema34: 0,
      macd: 0,
      signal: 0,
      stddv: 0,
      upper: 0,
      lower: 0,
    };
  },
  updateWeekObject: (item, week, weekIndicators = null) => {
    if (weekIndicators !== null) {
      week = weekIndicators;
    }
    let high = 0;
    let low = 0;
    week.high > item[3] ? (high = week.high) : (high = item[3]);
    week.low < item[4] ? (low = week.low) : (low = item[4]);
    return {
      date: week.date,
      open: week.open,
      high: high,
      low: low,
      close: item[5],
      sma08: week.sma08,
      sma13: week.sma13,
      sma21: week.sma21,
      ema21: week.ema21,
      ema34: week.ema34,
      macd: week.macd,
      signal: week.signal,
      stddv: week.stddv,
      upper: week.upper,
      lower: week.lower,
    };
  },
  updateMonthObject: (item, month, monthIndicators = null) => {
    if (monthIndicators !== null) {
      month = monthIndicators;
    }
    let high = 0;
    let low = 0;
    month.high > item[3] ? (high = month.high) : (high = item[3]);
    month.low < item[4] ? (low = month.low) : (low = item[4]);
    return {
      date: month.date,
      open: month.open,
      high: high,
      low: low,
      close: item[5],
      sma08: month.sma08,
      sma13: month.sma13,
      sma21: month.sma21,
      ema21: month.ema21,
      ema34: month.ema34,
      macd: month.macd,
      signal: month.signal,
      stddv: month.stddv,
      upper: month.upper,
      lower: month.lower,
    };
  },
  combineHourly: (hours, week, month, item) => {
    const value = {
      code: item[0],
      values: [],
    };
    hours.map((hour) => {
      const single = {
        hourly: hour,
        daily: {
          date: item[1],
          open: item[2],
          high: item[3],
          low: item[4],
          close: item[5],
          sma08: 0,
          sma13: 0,
          sma21: 0,
          ema21: 0,
          ema34: 0,
          macd: 0,
          signal: 0,
          stddv: 0,
          upper: 0,
          lower: 0,
        },
        weekly: week,
        monthly: month,
      };
      value.values.push(single);
    });
    return value;
  },
  // convert daily value into hourly value accroding to it is bull or bear daily candle
  addHourly: (item) => {
    const hr = [];
    // bull candle
    if (item[5] > item[2]) {
      hr.push({
        date: item[1] + "103000",
        open: item[2],
        high: item[2],
        low: item[4],
        close: item[4],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "113000",
        open: item[4],
        high: item[2],
        low: item[4],
        close: item[2],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "140000",
        open: item[2],
        high: item[3],
        low: item[2],
        close: item[3],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "150000",
        open: item[3],
        high: item[3],
        low: item[5],
        close: item[5],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });
    } else {
      hr.push({
        date: item[1] + "103000",
        open: item[2],
        high: item[3],
        low: item[2],
        close: item[3],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "113000",
        open: item[3],
        high: item[3],
        low: item[2],
        close: item[2],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "140000",
        open: item[2],
        high: item[2],
        low: item[4],
        close: item[4],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });

      hr.push({
        date: item[1] + "150000",
        open: item[4],
        high: item[5],
        low: item[4],
        close: item[5],
        sma08: 0,
        sma13: 0,
        sma21: 0,
        ema21: 0,
        ema34: 0,
        macd: 0,
        signal: 0,
        stddv: 0,
        upper: 0,
        lower: 0,
      });
    }
    return hr;
  },
});
