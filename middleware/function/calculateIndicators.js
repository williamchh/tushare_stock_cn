const { sma, macd, bands } = require("./indicatorsSet");
const { hasInArray, getMacd } = require("./arrayUtils");
var self = (module.exports = {
  calculateIndicators: (stocks, startIndex = -1) => {
    let hours = [];
    let days = [];
    let weeks = [];
    let months = [];
    let dy = [];
    let we = [];
    let mt = [];

    let weekValue = null;
    let monthValue = null;

    if (startIndex === -1) {
      stocks.map((stock) => {
        stock.values.map((value) => {
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
      });

      weekValue = bindWeekMonth(we, weeks);
      monthValue = bindWeekMonth(mt, months);
    } else {
      var set = new Set();
      weekValue = stocks[0].week;
      monthValue = stocks[0].month;
      hours = stocks[0].values.map((v) => v.hourly.close);
      days = stocks[0].hst.days.map((d) => d.value.close);
      weeks = weekValue.map((d) => d.value);
      months = monthValue.map((d) => d.value);
      we = stocks[0].week.map((d) => d.date);
      mt = stocks[0].month.map((d) => d.date);
      stocks[0].values.forEach((v) => {
        set.add(v.daily.date);
      });
      dy = Array.from(set);
      //   weekValue = bindWeekMonthWithHst(we, weeks, stocks[0].week);
      //   monthValue = bindWeekMonthWithHst(mt, months, stocks[0].month);
      //   weeks = weekValue.map((v) => v.value);
      //   months = monthValue.map((v) => v.value);
    }

    const {
      mkd,
      sgn,
      ma08,
      ma13,
      ma21,
      em21,
      em34,
      ntSum08,
      ntSum13,
      ntSum21,
      up,
      low,
      sd,
    } = getMacd(stocks[0].values);

    const smaHourly08 = sma(8, hours, {
      hstValue: {
        ma: stocks[0].values.map((v) => v.hourly.sma08),
        nexSum: stocks[0].values.map((v) => v.hourly.nextSum08),
      },
      startIndex,
    });
    const smaHourly13 = sma(13, hours, {
      hstValue: {
        ma: stocks[0].values.map((v) => v.hourly.sma13),
        nexSum: stocks[0].values.map((v) => v.hourly.nextSum13),
      },
      startIndex,
    });
    const smaHourly21 = sma(21, hours, {
      hstValue: {
        ma: stocks[0].values.map((v) => v.hourly.sma21),
        nexSum: stocks[0].values.map((v) => v.hourly.nextSum21),
      },
      startIndex,
    });

    const smaDaily08 = sma(8, days, {
      hstValue: {
        ma: stocks[0].hst.days.map((d) => d.value.sma08),
        nexSum: stocks[0].hst.days.map((d) => d.value.nextSum08),
      },
      startIndex,
    });
    const smaDaily13 = sma(13, days, {
      hstValue: {
        ma: stocks[0].hst.days.map((d) => d.value.sma13),
        nexSum: stocks[0].hst.days.map((d) => d.value.nextSum13),
      },
      startIndex,
    });
    const smaDaily21 = sma(21, days, {
      hstValue: {
        ma: stocks[0].hst.days.map((d) => d.value.sma21),
        nexSum: stocks[0].hst.days.map((d) => d.value.nextSum21),
      },
      startIndex,
    });

    const smaWeekly08 = sma(8, weeks, {
      hstValue: {
        ma: stocks[0].hst.weeks.map((d) => d.value.sma08),
        nexSum: stocks[0].hst.weeks.map((d) => d.value.nextSum08),
      },
      startIndex,
    });
    const smaWeekly13 = sma(13, weeks, {
      hstValue: {
        ma: stocks[0].hst.weeks.map((d) => d.value.sma13),
        nexSum: stocks[0].hst.weeks.map((d) => d.value.nextSum13),
      },
      startIndex,
    });
    const smaWeekly21 = sma(21, weeks, {
      hstValue: {
        ma: stocks[0].hst.weeks.map((d) => d.value.sma21),
        nexSum: stocks[0].hst.weeks.map((d) => d.value.nextSum21),
      },
      startIndex,
    });

    const smaMonthly08 = sma(8, months, {
      hstValue: {
        ma: ma08.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.sma08),
        nexSum: ntSum08.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.nextSum08),
      },
      startIndex,
    });
    const smaMonthly13 = sma(13, months, {
      hstValue: {
        ma: ma13.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.sma13),
        nexSum: ntSum13.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.nextSum13),
      },
      startIndex,
    });
    const smaMonthly21 = sma(21, months, {
      hstValue: {
        ma: ma21.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.sma21),
        nexSum: ntSum21.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.nextSum21),
      },
      startIndex,
    });

    const macdHourly = macd(21, 34, 8, hours, {
      hstValue: {
        fast21: stocks[0].values.map((v) => v.hourly.ema21),
        slow34: stocks[0].values.map((v) => v.hourly.ema34),
        mkd: stocks[0].values.map((v) => v.hourly.macd),
        sgn: stocks[0].values.map((v) => v.hourly.signal),
      },
      startIndex,
    });
    const macdDaily = macd(21, 34, 8, days, {
      hstValue: {
        fast21: stocks[0].hst.days.map((d) => d.value.ema21),
        slow34: stocks[0].hst.days.map((d) => d.value.ema34),
        mkd: stocks[0].hst.days.map((d) => d.value.macd),
        sgn: stocks[0].hst.days.map((d) => d.value.signal),
      },
      startIndex,
    });
    const macdWeekly = macd(21, 34, 8, weeks, {
      hstValue: {
        fast21: stocks[0].hst.weeks.map((d) => d.value.ema21),
        slow34: stocks[0].hst.weeks.map((d) => d.value.ema34),
        mkd: stocks[0].hst.weeks.map((d) => d.value.macd),
        sgn: stocks[0].hst.weeks.map((d) => d.value.signal),
      },
      startIndex,
    });

    const macdMonthly = macd(21, 34, 8, months, {
      hstValue: {
        fast21: em21.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.ema21),
        slow34: em34.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.ema34),
        mkd: mkd.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.macd),
        sgn: sgn.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.signal),
      },
      startIndex,
    });

    const bandHourly = bands(21, 1.618, hours, smaHourly21.sma, {
      hstValue: {
        u: stocks[0].values.map((v) => v.hourly.upper),
        l: stocks[0].values.map((v) => v.hourly.lower),
        sd: stocks[0].values.map((v) => v.hourly.stddv),
      },
      startIndex,
    });
    const bandDaily = bands(21, 1.618, days, smaDaily21.sma, {
      hstValue: {
        u: stocks[0].hst.days.map((d) => d.value.upper),
        l: stocks[0].hst.days.map((d) => d.value.lower),
        sd: stocks[0].hst.days.map((d) => d.value.stddv),
      },
      startIndex,
    });
    const bandWeekly = bands(21, 1.618, weeks, smaWeekly21.sma, {
      hstValue: {
        u: stocks[0].hst.weeks.map((d) => d.value.upper),
        l: stocks[0].hst.weeks.map((d) => d.value.lower),
        sd: stocks[0].hst.weeks.map((d) => d.value.stddv),
      },
      startIndex,
    });
    const bandMonthly = bands(21, 1.618, months, smaMonthly21.sma, {
      hstValue: {
        u: up.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.upper),
        l: low.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.lower),
        sd: sd.map((v) => v.value), // stocks[0].hst.months.map((d) => d.value.stddv),
      },
      startIndex,
    });

    return {
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
    };
  },
  // dailyUpdateCalculation: () => {},

  // initialCalculation: () => {}
});

function bindWeekMonth(date, value) {
  let res = [];
  for (let i = 0; i < date.length; i++)
    res.push({ date: date[i], value: value[i] });

  return res;
}

function bindWeekMonthWithHst(date, value, hst) {
  let res = [];
  for (let i = 0; i < date.length; i++)
    res.push({ date: date[i], value: value[i] });

  const d = date[date.length - 1];

  let cnt = 0;
  let fnd = false;
  while (!fnd && cnt < hst.length) {
    if (hst[cnt].date === d) fnd = true;

    cnt++;
  }

  for (let i = cnt; i < hst.length; i++) res.push(hst[i]);

  return res;
}
