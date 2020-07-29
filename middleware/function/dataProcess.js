
var self = module.exports = {
  combineCandleValuesWithIndicators: (stock, combinedDataSet) => {
    const {
      smaHourly08, smaHourly13, smaHourly21,
      smaDaily08, smaDaily13, smaDaily21,
      smaWeekly08, smaWeekly13, smaWeekly21,
      smaMonthly08, smaMonthly13, smaMonthly21,
      macdHourly, macdDaily, macdWeekly, macdMonthly,
      bandHourly, bandDaily, bandWeekly, bandMonthly,
      dy, we, mt
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
      stock.values[cnt].hourly.sma08 = parseFloat(smaHourly08[cnt]);
      stock.values[cnt].hourly.sma13 = parseFloat(smaHourly13[cnt]);
      stock.values[cnt].hourly.sma21 = parseFloat(smaHourly21[cnt]);

      // daily
      if (value.daily.date === dy[cntDay]) {
        stock.values[cnt].daily.macd = parseFloat(macdDaily.macd[cntDay]);
        stock.values[cnt].daily.signal = parseFloat(macdDaily.signal[cntDay]);
        stock.values[cnt].daily.ema21 = parseFloat(macdDaily.ema21[cntDay]);
        stock.values[cnt].daily.ema34 = parseFloat(macdDaily.ema34[cntDay]);
        stock.values[cnt].daily.stddv = parseFloat(bandDaily.stddev[cntDay]);
        
        stock.values[cnt].daily.upper = parseFloat(bandDaily.upperBand[cntDay]);
        stock.values[cnt].daily.lower = parseFloat(bandDaily.lowerBand[cntDay]);
        
        stock.values[cnt].daily.sma08 = parseFloat(smaDaily08[cntDay]);
        stock.values[cnt].daily.sma13 = parseFloat(smaDaily13[cntDay]);
        stock.values[cnt].daily.sma21 = parseFloat(smaDaily21[cntDay]);
      } else {
        cntDay++;
        stock.values[cnt].daily.macd = parseFloat(macdDaily.macd[cntDay]);
        stock.values[cnt].daily.signal = parseFloat(macdDaily.signal[cntDay]);
        stock.values[cnt].daily.ema21 = parseFloat(macdDaily.ema21[cntDay]);
        stock.values[cnt].daily.ema34 = parseFloat(macdDaily.ema34[cntDay]);
        stock.values[cnt].daily.stddv = parseFloat(bandDaily.stddev[cntDay]);
        stock.values[cnt].daily.upper = parseFloat(bandDaily.upperBand[cntDay]);
        stock.values[cnt].daily.lower = parseFloat(bandDaily.lowerBand[cntDay]);
        stock.values[cnt].daily.sma08 = parseFloat(smaDaily08[cntDay]);
        stock.values[cnt].daily.sma13 = parseFloat(smaDaily13[cntDay]);
        stock.values[cnt].daily.sma21 = parseFloat(smaDaily21[cntDay]);
      }

      // weekly
      if (value.weekly.date === we[cntWeek]) {
        stock.values[cnt].weekly.macd = parseFloat(macdWeekly.macd[cntWeek]);
        stock.values[cnt].weekly.signal = parseFloat(macdWeekly.signal[cntWeek]);
        stock.values[cnt].weekly.ema21 = parseFloat(macdWeekly.ema21[cntWeek]);
        stock.values[cnt].weekly.ema34 = parseFloat(macdWeekly.ema34[cntWeek]);
        stock.values[cnt].weekly.stddv = parseFloat(bandWeekly.stddev[cntWeek]);
        stock.values[cnt].weekly.upper = parseFloat(bandWeekly.upperBand[cntWeek]);
        stock.values[cnt].weekly.lower = parseFloat(bandWeekly.lowerBand[cntWeek]);
        
        stock.values[cnt].weekly.sma08 = parseFloat(smaWeekly08[cntWeek]);
        stock.values[cnt].weekly.sma13 = parseFloat(smaWeekly13[cntWeek]);
        stock.values[cnt].weekly.sma21 = parseFloat(smaWeekly21[cntWeek]);
      } else {
        cntWeek++;
        stock.values[cnt].weekly.macd = parseFloat(macdWeekly.macd[cntWeek]);
        stock.values[cnt].weekly.signal = parseFloat(macdWeekly.signal[cntWeek]);
        stock.values[cnt].weekly.ema21 = parseFloat(macdWeekly.ema21[cntWeek]);
        stock.values[cnt].weekly.ema34 = parseFloat(macdWeekly.ema34[cntWeek]);
        stock.values[cnt].weekly.stddv = parseFloat(bandWeekly.stddev[cntWeek]);
        stock.values[cnt].weekly.upper = parseFloat(bandWeekly.upperBand[cntWeek]);
        stock.values[cnt].weekly.lower = parseFloat(bandWeekly.lowerBand[cntWeek]);
        stock.values[cnt].weekly.sma08 = parseFloat(smaWeekly08[cntWeek]);
        stock.values[cnt].weekly.sma13 = parseFloat(smaWeekly13[cntWeek]);
        stock.values[cnt].weekly.sma21 = parseFloat(smaWeekly21[cntWeek]);
      }

      // Month
      if (value.monthly.date === mt[cntMonth]) {
        stock.values[cnt].monthly.macd = parseFloat(macdMonthly.macd[cntMonth]);
        stock.values[cnt].monthly.signal = parseFloat(macdMonthly.signal[cntMonth]);
        stock.values[cnt].monthly.ema21 = parseFloat(macdMonthly.ema21[cntMonth]);
        stock.values[cnt].monthly.ema34 = parseFloat(macdMonthly.ema34[cntMonth]);
        stock.values[cnt].monthly.stddv = parseFloat(bandMonthly.stddev[cntMonth]);
        stock.values[cnt].monthly.upper = parseFloat(bandMonthly.upperBand[cntMonth]);
        stock.values[cnt].monthly.lower = parseFloat(bandMonthly.lowerBand[cntMonth]);
        
        stock.values[cnt].monthly.sma08 = parseFloat(smaMonthly08[cntMonth]);
        stock.values[cnt].monthly.sma13 = parseFloat(smaMonthly13[cntMonth]);
        stock.values[cnt].monthly.sma21 = parseFloat(smaMonthly21[cntMonth]);
      } else {
        cntMonth++;
        stock.values[cnt].monthly.macd = parseFloat(macdMonthly.macd[cntMonth]);
        stock.values[cnt].monthly.signal = parseFloat(macdMonthly.signal[cntMonth]);
        stock.values[cnt].monthly.ema21 = parseFloat(macdMonthly.ema21[cntMonth]);
        stock.values[cnt].monthly.ema34 = parseFloat(macdMonthly.ema34[cntMonth]);
        stock.values[cnt].monthly.stddv = parseFloat(bandMonthly.stddev[cntMonth]);
        stock.values[cnt].monthly.upper = parseFloat(bandMonthly.upperBand[cntMonth]);
        stock.values[cnt].monthly.lower = parseFloat(bandMonthly.lowerBand[cntMonth]);
        stock.values[cnt].monthly.sma08 = parseFloat(smaMonthly08[cntMonth]);
        stock.values[cnt].monthly.sma13 = parseFloat(smaMonthly13[cntMonth]);
        stock.values[cnt].monthly.sma21 = parseFloat(smaMonthly21[cntMonth]);
      }

      cnt++;
    }

    return stock;
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
          }
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
          }
    },
    updateWeekObject: (item, week) => {
        let high = 0;
        let low = 0;
        week.high > item[3] ? high = week.high : high = item[3];
        week.low < item[4] ? low = week.low : low = item[4];
        return {
            date: week.date,
            open: week.open,
            high: high,
            low: low,
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
    updateMonthObject: (item, month) => {
        let high = 0;
        let low = 0;
        month.high > item[3] ? high = month.high : high = item[3];
        month.low < item[4] ? low = month.low : low = item[4];
        return {
            date: month.date,
            open: month.open,
            high: high,
            low: low,
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
    } else {
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
    }
    return hr;
  }
  
}