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

        let smaHstHour08 = null, smaHstHour13 = null, smaHstHour21 = null;
        let smaHstDay08 = null, smaHstDay13 = null, smaHstDay21 = null;
        let smaHstWeek08 = null, smaHstWeek13 = null, smaHstWeek21 = null;
        let smaHstMonth08 = null, smaHstMonth13 = null, smaHstMonth21 = null;
        let macdHstHour = null, macdHstDay = null, macdHstWeek = null, macdHstMonth = null;
        let ema21HstHour = null, ema21HstDay = null, ema21HstWeek = null, ema21HstMonth = null;
        let ema34HstHour = null, ema34HstDay = null, ema34HstWeek = null, ema34HstMonth = null;
        let upperHstHour = null, upperHstDay = null, upperHstWeek = null, upperHstMonth = null;
        let lowerHstHour = null, lowerHstDay = null, lowerHstWeek = null, lowerHstMonth = null;
        

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
        }
        else {
            hours = stocks[0].values.map(v => v.hourly.close);
            days = stocks[0].hst.days.map(d => d.value.close);
            weeks = stocks[0].week.map(d => d.value);
            months = stocks[0].month.map(d => d.value);
            we = stocks[0].week.map(d => d.date);
            mt = stocks[0].month.map(d => d.date);
            weekValue = bindWeekMonthWithHst(we, weeks, stocks[0].week);
            monthValue = bindWeekMonthWithHst(mt, months, stocks[0].month);
            weeks = weekValue.map(v => v.value);
            months = monthValue.map(v => v.value);
            
            smaHstHour08 = stocks[0].values.map(v => v.hourly.sma08);
            smaHstHour13 = stocks[0].values.map(v => v.hourly.sma13);
            smaHstHour21 = stocks[0].values.map(v => v.hourly.sma21);
            macdHstHour = stocks[0].values.map(v => v.hourly.macd);
            upperHstHour = stocks[0].values.map(v => v.hourly.upper);
            lowerHstHour = stocks[0].values.map(v => v.hourly.lower);
            ema21HstHour = stocks[0].values.map(v => v.hourly.ema21);
            ema34HstHour = stocks[0].values.map(v => v.hourly.ema34);


            smaHstDay08 = stocks[0].hst.days.map(d => d.value.sma08);
            smaHstDay13 = stocks[0].hst.days.map(d => d.value.sma13);
            smaHstDay21 = stocks[0].hst.days.map(d => d.value.sma21);
            smaHstWeek08 = stocks[0].hst.weeks.map(d => d.value.sma08);
            smaHstWeek13 = stocks[0].hst.weeks.map(d => d.value.sma13);
            smaHstWeek21 = stocks[0].hst.weeks.map(d => d.value.sma21);
            smaHstMonth08 = stocks[0].hst.months.map(d => d.value.sma08);
            smaHstMonth13 = stocks[0].hst.months.map(d => d.value.sma13);
            smaHstMonth21 = stocks[0].hst.months.map(d => d.value.sma21);

            macdHstDay = stocks[0].hst.days.map(d => d.value.macd);
            macdHstWeek = stocks[0].hst.weeks.map(d => d.value.macd);
            macdHstMonth = stocks[0].hst.months.map(d => d.value.macd);

            ema21HstDay = stocks[0].hst.days.map(d => d.value.ema21);
            ema34HstDay = stocks[0].hst.days.map(d => d.value.ema34);
            ema21HstWeek = stocks[0].hst.weeks.map(d => d.value.ema21);
            ema34HstWeek = stocks[0].hst.weeks.map(d => d.value.ema34);
            ema21HstMonth = stocks[0].hst.months.map(d => d.value.ema21);
            ema34HstMonth = stocks[0].hst.months.map(d => d.value.ema34);

            upperHstDay = stocks[0].hst.days.map(d => d.value.upper);
            lowerHstDay = stocks[0].hst.days.map(d => d.value.lower);
            upperHstWeek = stocks[0].hst.weeks.map(d => d.value.upper);
            lowerHstWeek = stocks[0].hst.weeks.map(d => d.value.lower);
            upperHstMonth = stocks[0].hst.months.map(d => d.value.upper);
            lowerHstMonth = stocks[0].hst.months.map(d => d.value.lower);
        }



        const smaHourly08 = sma(8, hours, { hstValue: smaHstHour08, startIndex});
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