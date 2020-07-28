const axios = require("axios");
const { sma, ema, macd, bands } = require("./function/getIndicators");

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

      req.j = stocks.data;
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
    const { items } = req.j.data;
    const stocks = [];

    if (items.length > 0) {
      items.map((item) => {
        // add hourly value set into item which only contain daily value set in 'item'
        const c = addHourly(item);
        const value = combineHourly(c, item);

        const index = stocks.findIndex((x) => x.code == value.code);
        if (index === -1) {
          stocks.push(value);
        } else {
          stocks[index].values = stocks[index].values.concat(value.values);
        }
      });
    }

    req.codes = stocks;

    next();
  },

  getIndicators: (req, res, next) => {
    const stocks = req.codes;
    const hours = [];

    stocks.map((stock) => {
      stock.values.map((value) => {
        const { hourly } = value;

        hours.push(hourly.close); //((hourly.high + hourly.low + hourly.close * 2) / 4.0);
      });
    });

    const smaHourly08 = sma(8, hours);
    const emaHourly08 = ema(8, hours);
    const macdHourly = macd(21, 34, 8, hours);
    const smaHourly21 = sma(21, hours);
    const { upperBand, lowerBand } = bands(21, 1.618, hours, smaHourly21);

    console.log(smaHourly08.length);
    // console.log(ema08.length)

    next();
  },
};

function combineHourly(hours, item) {
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
      weekly: null,
      monthly: null,
    };
    value.values.push(single);
  });
  return value;
}

// convert daily value into hourly value accroding to it is bull or bear daily candle
function addHourly(item) {
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
