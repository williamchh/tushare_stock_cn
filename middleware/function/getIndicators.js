var self = (module.exports = {
  sma: (period, prices, hst = null) => {
    let len = prices.length;
    let sma = [];
    let nextSum = [];

    let sum = 0;
    let pos = len - 1;

    // -- initial accumulation
    if (pos < period) {
      pos = period;
    }
    for (let i = 1; i < period; i++, pos--) {
      sum = sum + Number(prices[pos]);
    }

    // --- main caculation loop
    const { hstValue, startIndex } = hst;
    if (startIndex > -1) {
      pos = startIndex + 1;
      len = pos;
      sum = hstValue.nexSum[pos];
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
    const { hstValue, startIndex } = hst;

    let buffer = [];
    const pr = 2.0 / (period + 1);
    const len = prices.length - 2;

    let pos = len;
    if (startIndex > -1) {
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

    if (hst.startIndex === -1) {
      emaFast = self.ema(fast, prices);
      emaSlow = self.ema(slow, prices);
    } else {
      emaFast = self.ema(fast, prices, hst);
      emaSlow = self.ema(slow, prices, hst);
    }

    const len = prices.length;
    let pos = len;

    // MACD calculation
    while (pos >= 0) {
      if (pos > len - slow) macd[pos - 1] = 0;
      else macd[pos] = parseFloat(emaFast[pos] - emaSlow[pos]).toFixed(5);

      pos--;
    }

    // SIGNAL calculation
    if (hst.startIndex === -1) signals = self.ema(signal, macd);
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
      pos = hst.startIndex + 1;
    }

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

    return stddev;
  },
});

// int start()
//   {
//    int    i,j,nLimit,nCountedBars;
//    double dAPrice,dAmount,dMovingAverage;
// //---- insufficient data
//    if(Bars<=ExtStdDevPeriod) return(0);
// //---- bars count that does not changed after last indicator launch.
//    nCountedBars=IndicatorCounted();
// //----Standard Deviation calculation
//    i=Bars-ExtStdDevPeriod-1;
//    if(nCountedBars>ExtStdDevPeriod)
//       i=Bars-nCountedBars;
//    while(i>=0)
//      {
//       dAmount=0.0;
//       dMovingAverage=iMA(NULL,0,ExtStdDevPeriod,0,ExtStdDevMAMethod,ExtStdDevAppliedPrice,i);
//       for(j=0; j<ExtStdDevPeriod; j++)
//         {
//          dAPrice=GetAppliedPrice(ExtStdDevAppliedPrice,i+j);
//          dAmount+=(dAPrice-dMovingAverage)*(dAPrice-dMovingAverage);
//         }
//       ExtStdDevBuffer[i]=MathSqrt(dAmount/ExtStdDevPeriod);
//       i--;
//      }
// //----
//    return(0);
//   }
// //+------------------------------------------------------------------+
// //|                                                                  |
// //+------------------------------------------------------------------+
// double GetAppliedPrice(int nAppliedPrice, int nIndex)
//   {
//    double dPrice;
// //----
//    switch(nAppliedPrice)
//      {
//       case 0:  dPrice=Close[nIndex];                                  break;
//       case 1:  dPrice=Open[nIndex];                                   break;
//       case 2:  dPrice=High[nIndex];                                   break;
//       case 3:  dPrice=Low[nIndex];                                    break;
//       case 4:  dPrice=(High[nIndex]+Low[nIndex])/2.0;                 break;
//       case 5:  dPrice=(High[nIndex]+Low[nIndex]+Close[nIndex])/3.0;   break;
//       case 6:  dPrice=(High[nIndex]+Low[nIndex]+2*Close[nIndex])/4.0; break;
//       default: dPrice=0.0;
//      }
// //----
//    return(dPrice);
//   }
