const axios = require("axios");

module.exports = {
  getStockData: async (req, res, next) => {
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
        start_date: "20200722",
        end_date: "20200724",
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

    if (items.length > 0) {
      items.map((item) => console.log(`close => (${item[5]})`));
    }
    req.codes = req.j;
    next();
  },
};
