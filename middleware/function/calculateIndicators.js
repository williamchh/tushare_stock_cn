const { sma, macd, bands } = require("./getIndicators");
const { hasInArray } = require("./arrayUtils")
var self = module.exports = {
    calculateIndicators: (stocks, startIndex = -1) => {
        let hours = [];
        let days = [];
        let weeks = [];
        let months = [];
        let dy = [];
        let we = [];
        let mt = [];

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

        let weekValue = null;
        let monthValue = null;
        if (startIndex === -1) {
            weekValue = bindWeekMonth(we, weeks);
            monthValue = bindWeekMonth(mt, months);
        }
        else {
            weekValue = bindWeekMonthWithHst(we, weeks, stocks[0].week);
            monthValue = bindWeekMonthWithHst(mt, months, stocks[0].month);
            weeks = weekValue.map(v => v.value);
            months = monthValue.map(v => v.value); 
        }

        const smaHourly08 = sma(8, hours, startIndex);
        const smaHourly13 = sma(13, hours, startIndex);
        const smaHourly21 = sma(21, hours, startIndex);

        const smaDaily08 = sma(8, days, startIndex);
        const smaDaily13 = sma(13, days, startIndex);
        const smaDaily21 = sma(21, days, startIndex);

        const smaWeekly08 = sma(8, weeks, startIndex);
        const smaWeekly13 = sma(13, weeks, startIndex);
        const smaWeekly21 = sma(21, weeks, startIndex);

        const smaMonthly08 = sma(8, months, startIndex);
        const smaMonthly13 = sma(13, months, startIndex);
        const smaMonthly21 = sma(21, months, startIndex);

        const macdHourly = macd(21, 34, 8, hours, startIndex);
        const macdDaily = macd(21, 34, 8, days, startIndex);
        const macdWeekly = macd(21, 34, 8, weeks, startIndex);
        const macdMonthly = macd(21, 34, 8, months, startIndex);

        const bandHourly = bands(21, 1.618, hours, smaHourly21.sma, startIndex);
        const bandDaily = bands(21, 1.618, days, smaDaily21.sma, startIndex);
        const bandWeekly = bands(21, 1.618, weeks, smaWeekly21.sma, startIndex);
        const bandMonthly = bands(21, 1.618, months, smaMonthly21.sma, startIndex);

        return {
            smaHourly08, smaHourly13, smaHourly21,
            smaDaily08, smaDaily13, smaDaily21,
            smaWeekly08, smaWeekly13, smaWeekly21,
            smaMonthly08, smaMonthly13, smaMonthly21,
            macdHourly, macdDaily, macdWeekly, macdMonthly,
            bandHourly, bandDaily, bandWeekly, bandMonthly,
            dy, we, mt, weekValue, monthValue
          };
    }
}

function bindWeekMonth(date, value) {
    let res = [];
    for (let i = 0; i < date.length; i++) 
        res.push({date: date[i], value: value[i]})        
    
    return res;
}

function bindWeekMonthWithHst(date, value, hst) {
    let res = [];
    for (let i = 0; i < date.length; i++) 
        res.push({date: date[i], value: value[i]});
    
    const d = date[date.length - 1];

    let cnt = 0;
    let fnd = false;
    while (!fnd && cnt < hst.length) {
        if (hst[cnt].date === d) 
            fnd = true;
        
        cnt++;
    }

    for (let i = cnt; i < hst.length; i++)
        res.push(hst[i]);


    return res;
}