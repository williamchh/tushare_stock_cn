const axios = require("axios");
const {
  calculateIndicators,
} = require("../middleware/function/calculateIndicators");
const {
  dateString,
  getWeekNumber,
  getMonthNumber,
  weeksInYear,
  sinaModelDate,
} = require("./function/dateUtils");
const {
  getNewWeekObject,
  getNewMonthObject,
  updateMonthObject,
  updateWeekObject,
  combineHourly,
  combineCandleValuesWithIndicators,
  addHourly,
} = require("./function/dataProcess");
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
      return res.send(error.message);
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
      req.stock = {};
      req.stock.data = stocks.data;
    } catch (error) {
      console.log(error);
      return res.send(error.response);
    }

    next();
  },

  processHourly: (req, res, next) => {
    Array.prototype.elementIndex = function (item, index) {
      var array = new Array(this.valueOf());
      let cnt = 0;

      while (cnt < array[0].length) {
        if (array[0][cnt].code === item[index]) return cnt;
        cnt++;
      }

      return -1;
    };
    const { items } = req.stock.data.data;
    const stocks = [];

    if (items.length > 0) {
      items.reverse();

      items.forEach((item) => {
        let index = stocks.elementIndex(item, 0);
        const hour = addHourly(item);

        hour.forEach((value) => {
          value.day = sinaModelDate(value.date);
          value.open = value.open.toFixed(3);
          value.high = value.high.toFixed(3);
          value.low = value.low.toFixed(3);
          value.close = value.close.toFixed(3);
          value.volume = "0";
          delete value.date;
          delete value.ema21;
          delete value.ema34;
          delete value.sma08;
          delete value.sma13;
          delete value.sma21;
          delete value.macd;
          delete value.signal;
          delete value.upper;
          delete value.lower;
          delete value.stddv;
          delete value.nextSum08;
          delete value.nextSum13;
          delete value.nextSum21;
        });

        if (index === -1) {
          stocks.push({ code: item[0], hours: hour });
        } else {
          stocks[index].hours = stocks[index].hours.concat(hour);
        }
        // stocks.unshift(hour);
      });
    }

    req.stock.hour = stocks;
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

      items.forEach((item) => {
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
        const value = combineHourly(hour, week, month, item);

        const index = stocks.findIndex((x) => x.code == value.code);
        if (index === -1) {
          stocks.push(value);
        } else {
          stocks[index].values = stocks[index].values.concat(value.values);
        }
      });
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

    stocks[0] = {
      ...stocks[0],
      hst: { days: [], weeks: [], months: [] },
    };

    let combinedDataSet = calculateIndicators(stocks);

    const { stockValue, weekMonth } = combineCandleValuesWithIndicators(
      stocks[0],
      combinedDataSet
    );

    req.stock.finalStock = stockValue;
    req.stock.weekMonth = weekMonth;

    console.log(combinedDataSet.smaHourly08.sma.length);
    // console.log(ema08.length)

    next();
  },
};
