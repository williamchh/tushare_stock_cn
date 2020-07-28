
var self = module.exports = {
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