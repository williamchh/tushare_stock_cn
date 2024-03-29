const { isEqual } = require("./setUtils");

module.exports = {
  reverseArray: (array) => {
    return array.slice(0).reverse();
  },

  hasInArray: (weekly, wkDate) => {
    let has = false;
    const len = wkDate.length;
    let cnt = 0;
    while (!has && cnt < len) {
      if (wkDate[cnt] === weekly.date) has = true;
      cnt++;
    }

    return has;
  },

  getMacd: (values) => {
    Set.prototype.addObj = function (obj) {
      var set = new Set(this.valueOf());

      let has = false;
      set.forEach((s) => {
        if (isEqual(s, obj)) has = true;
      });

      if (!has) {
        set.add(obj);
      }
      return set;
    };

    let mkd = new Set();
    let sgn = new Set();
    let ma08 = new Set();
    let ma13 = new Set();
    let ma21 = new Set();
    let em21 = new Set();
    let em34 = new Set();
    let ntSum08 = new Set();
    let ntSum13 = new Set();
    let ntSum21 = new Set();
    let up = new Set();
    let low = new Set();
    let sd = new Set();

    values.forEach((value) => {
      mkd = mkd.addObj({ date: value.monthly.date, value: value.monthly.macd });
      sgn = sgn.addObj({
        date: value.monthly.date,
        value: value.monthly.signal,
      });
      em21 = em21.addObj({
        date: value.monthly.date,
        value: value.monthly.ema21,
      });
      em34 = em34.addObj({
        date: value.monthly.date,
        value: value.monthly.ema34,
      });
      ma08 = ma08.addObj({
        date: value.monthly.date,
        value: value.monthly.sma08,
      });
      ma13 = ma13.addObj({
        date: value.monthly.date,
        value: value.monthly.sma13,
      });
      ma21 = ma21.addObj({
        date: value.monthly.date,
        value: value.monthly.sma21,
      });
      ntSum08 = ntSum08.addObj({
        date: value.monthly.date,
        value: value.monthly.nextSum08,
      });
      ntSum13 = ntSum13.addObj({
        date: value.monthly.date,
        value: value.monthly.nextSum13,
      });
      ntSum21 = ntSum21.addObj({
        date: value.monthly.date,
        value: value.monthly.nextSum21,
      });
      up = up.addObj({ date: value.monthly.date, value: value.monthly.upper });
      low = low.addObj({
        date: value.monthly.date,
        value: value.monthly.lower,
      });
      sd = sd.addObj({ date: value.monthly.date, value: value.monthly.stddv });
    });
    return {
      mkd: Array.from(mkd),
      sgn: Array.from(sgn),
      ma08: Array.from(ma08),
      ma13: Array.from(ma13),
      ma21: Array.from(ma21),
      em21: Array.from(em21),
      em34: Array.from(em34),
      ntSum08: Array.from(ntSum08),
      ntSum13: Array.from(ntSum13),
      ntSum21: Array.from(ntSum21),
      up: Array.from(up),
      low: Array.from(low),
      sd: Array.from(sd),
    };
  },

  ///
  /// mostly used in the daily update activities
  ///
  groupByNum: (arr, n) => {
    var group = [];
    for (var i = 0, end = arr.length / n; i < end; ++i)
      group.push(arr.slice(i * n, (i + 1) * n));
    return group;
  },

  getOldestDate: (arr) => {
    let oldestDate = arr[0];
    arr.forEach((d) => {
      if (d < oldestDate) oldestDate = d;
    });
    return oldestDate;
  },

  arrGetDatesAndCodes: (arr) => {
    let date = [];
    let ts_code = [];
    arr.forEach((a) => {
      date.push(a.start_date);
      ts_code.push(a.ts_code.trim());
    });
    return { date, ts_code };
  },
};
