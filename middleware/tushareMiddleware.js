const axios = require("axios");
const { sma, macd, bands } = require("./function/getIndicators");
const { hasInArray } = require("./function/arrayUtils")
const { dateString, getWeekNumber, getMonthNumber, weeksInYear } = require("./function/dateUtils")
const { getNewWeekObject, 
        getNewMonthObject, 
        updateMonthObject, 
        updateWeekObject, 
        combineHourly,
        combineCandleValuesWithIndicators,
        addHourly} = require("./function/dataProcess")
module.exports = {
  getStockDataAll: async (req, res, next) => {
    // query from headers
    const codes = req.header("ts-code");

    if (!codes) {
      return res.status(401).json({ msg: "Invalid Query" });
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const postData = {
      api_name: "daily",
      token: "64db66258b8f9484488e13958907082fe21aa6e58716cbe333de8b28",
      params: {
        ts_code: codes,
      },
      fields: "ts_code, trade_date, open, high, low, close",
    };
    try {
      const stocks = await axios.post(
        "https://api.waditu.com",
        postData,
        config
      );
      
      req.stock = {};
      req.stock.latestDate = dateString(stocks.data.data.items[0][1]);
      req.stock.data = stocks.data;
    } catch (error) {
      console.log(error);
      return res.send(error.response);
    }

    next();
  },

  getStockData: async (req, res, next) => {
    // query from headers
    const codes = req.header("ts-code");
    const startDate = req.header("startdate"); // early date
    const endDate = req.header("enddate"); // recent date

    if (!codes || !startDate || !endDate) {
      return res.status(401).json({ msg: "Invalid Query" });
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const postData = {
      api_name: "daily",
      token: "64db66258b8f9484488e13958907082fe21aa6e58716cbe333de8b28",
      params: {
        ts_code: codes,
        start_date: startDate,
        end_date: endDate,
      },
      fields: "ts_code, trade_date, open, high, low, close",
    };
    try {
      const stocks = await axios.post(
        "https://api.waditu.com",
        postData,
        config
      );

      req.j = stocks.data;
    } catch (error) {
      console.log(error);
      return res.send(error.response);
    }

    next();
  },

  processData: (req, res, next) => {
    const { items } = req.stock.data.data;
    const stocks = [];

    let week = null;
    let month = null;
    let cpWk = [0, 0];
    let cpMn = [0, 0];

    if (items.length > 0) {

      items.reverse();

      items.map((item) => {

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
        const value = combineHourly(hour, week, month, item);

        const index = stocks.findIndex((x) => x.code == value.code);
        if (index === -1) {
          stocks.push(value);
        } else {
          stocks[index].values = stocks[index].values.concat(value.values);
        }
      }
      
      
      );


    }

    // TODO reverse stock values in order to get correct indicators
    const vs = stocks[0].values;
    vs.reverse();
    stocks[0].values = vs;

    req.stock.values = stocks;

    next();
  },

  getIndicators: (req, res, next) => {
    let stocks = req.stock.values;
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

    const bandHourly = bands(21, 1.618, hours, smaHourly21);
    const bandDaily = bands(21, 1.618, days, smaDaily21);
    const bandWeekly = bands(21, 1.618, weeks, smaWeekly21);
    const bandMonthly = bands(21, 1.618, months, smaMonthly21);

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
    
    console.log(smaHourly08.length);
    // console.log(ema08.length)

    next();
  },
};


 

