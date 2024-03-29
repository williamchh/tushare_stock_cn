var self = (module.exports = {
  sma: (period, prices, hst = null) => {
    let len = prices.length;
    let sma = [];
    let nextSum = [];

    let sum = 0;
    let pos = len - 1;

    // --- main caculation loop
    const { hstValue, startIndex } = hst;
    if (startIndex > -1) {
      pos = startIndex + 1;
      len = pos;
      sum = hstValue.nexSum[pos + 1];
      sma = hstValue.ma;
      nextSum = hstValue.nexSum;

      while (len >= 0) {
        sum = sum + Number(prices[pos]);
        sma[pos] = parseFloat(sum / period).toFixed(5);
        sum = sum - prices[pos + period - 1];
        nextSum[pos] = parseFloat(sum).toFixed(5);

        pos--;
        len--;
      }
    } else {
      // -- initial accumulation
      if (pos < period) {
        pos = period;
      }
      for (let i = 1; i < period; i++, pos--) {
        sum = sum + Number(prices[pos]);
      }

      while (len >= 0) {
        if (len > pos) {
          sma[len - 1] = 0;

          len--;
        } else {
          sum = sum + Number(prices[pos]);
          sma[pos] = parseFloat(sum / period).toFixed(5);
          sum = sum - prices[pos + period - 1];
          nextSum[pos] = parseFloat(sum).toFixed(5);

          pos--;
          len--;
        }
      }
    }

    return { sma, nextSum };
  },

  ema: (period, prices, hst = null) => {
    let buffer = [];
    const pr = 2.0 / (period + 1);
    const len = prices.length - 2;

    let pos = len;
    if (hst.startIndex > -1) {
      const { hstValue, startIndex } = hst;
      pos = startIndex + 1;

      if (period === 21) buffer = hstValue.fast21;
      else if (period === 34) buffer = hstValue.slow34;
      else buffer = hstValue.sgn;
    }

    while (pos >= 0) {
      if (pos === len) {
        buffer[pos + 1] = prices[pos + 1];
      }
      buffer[pos] = parseFloat(
        prices[pos] * pr + buffer[pos + 1] * (1 - pr)
      ).toFixed(5);
      pos--;
    }

    return buffer;
  },

  macd: (fast, slow, signal, prices, hst = null) => {
    let macd = [];
    let signals = [];
    let emaFast = [];
    let emaSlow = [];
    let len = prices.length;
    let pos = len;

    if (hst.startIndex === -1) {
      emaFast = self.ema(fast, prices, hst);
      emaSlow = self.ema(slow, prices, hst);
    } else {
      macd = hst.hstValue.mkd;
      signals = hst.hstValue.sgn;
      emaFast = self.ema(fast, prices, hst);
      emaSlow = self.ema(slow, prices, hst);
      len = hst.startIndex;
      pos = len;
    }

    // MACD calculation
    while (pos >= 0) {
      if (hst.startIndex > -1) {
        macd[pos] = parseFloat(emaFast[pos] - emaSlow[pos]).toFixed(5);
      } else {
        if (pos > len - slow) macd[pos - 1] = 0;
        else macd[pos] = parseFloat(emaFast[pos] - emaSlow[pos]).toFixed(5);
      }

      pos--;
    }

    // SIGNAL calculation
    if (hst.startIndex === -1) signals = self.ema(signal, macd, hst);
    else signals = self.ema(signal, macd, hst);

    return { macd, signal: signals, ema21: emaFast, ema34: emaSlow };
  },
  bands: (period, width, prices, ma21, hst = null) => {
    let stddev = [];
    let upperBand = [];
    let lowerBand = [];
    let len = ma21.length;

    if (hst.startIndex > -1) {
      upperBand = hst.hstValue.u;
      lowerBand = hst.hstValue.l;
      stddev = hst.hstValue.sd;
      len = hst.startIndex + 1;
    }

    stddev = self.standardDeviation(prices, ma21, period, hst);
    for (let i = 0; i < len; i++) {
      upperBand[i] = parseFloat(
        parseFloat(ma21[i]) * 1 + width * parseFloat(stddev[i])
      ).toFixed(5);
      lowerBand[i] = parseFloat(
        parseFloat(ma21[i]) - width * parseFloat(stddev[i])
      ).toFixed(5);
    }

    return { upperBand, lowerBand, stddev };
  },
  // Standard Deviation
  // position: int, prices: array, ma: array, period: int
  standardDeviation: (prices, ma, period, hst = null) => {
    let stddev = [];

    let pos = prices.length;

    if (hst.startIndex > -1) {
      const { hstValue, startIndex } = hst;
      pos = hst.startIndex + 1;
      while (pos >= 0) {
        let sdd = 0.0;
        for (let i = 0; i < period; i++) {
          sdd += Math.pow(prices[pos + i] - ma[pos], 2);
        }
        stddev[pos] = parseFloat(Math.sqrt(sdd / period)).toFixed(5);

        pos--;
      }
      pos = stddev.length;
      while (pos < hstValue.sd.length) {
        stddev[pos] = hstValue.sd[pos];
        pos++;
      }
    } else {
      while (pos >= 0) {
        if (pos > ma.length - period) {
          stddev[pos - 1] = 0.0;
        } else {
          let sdd = 0.0;
          for (let i = 0; i < period; i++) {
            sdd += Math.pow(prices[pos + i] - ma[pos], 2);
          }
          stddev[pos] = parseFloat(Math.sqrt(sdd / period)).toFixed(5);
        }
        pos--;
      }
    }

    return stddev;
  },
});
