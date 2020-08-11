const {
  RenameObjectKey,
  ConvertDatetimeStr,
} = require("./function/toSinaModal");

module.exports = {
  ToSinaHourlyCollection: (req, res, next) => {
    const values = req.stock.values;
    const hs = values[0].values.map((a) => a.hourly);
    let hours = [];
    hs.forEach((h) => {
      hours.unshift(RenameObjectKey(h, "date", "day"));
    });

    req.stock.hours = hours;
    next();
  },
  ToSinaDailyCollection: (req, res, next) => {
    const stocks = req.stock.data.data.items;
    let sinaDaily = [];

    stocks.forEach((s) => {
      sinaDaily.unshift({
        day: ConvertDatetimeStr(s[1]),
        open: s[2],
        high: s[3],
        low: s[4],
        close: s[5],
        volume: "0",
      });
    });

    req.stock.days = sinaDaily;
    next();
  },
};
