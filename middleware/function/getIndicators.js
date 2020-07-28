
var self = module.exports = {
  sma: (period, prices) => {
    let len = prices.length;
    let buffer = [];

    let sum = 0;
    let pos = len - 1;

    // -- initial accumulation
    if (pos < period) {
      pos = period;
    }
    for (let i = 1; i < period; i++, pos--) {
      // console.log(`i => ${i} , pos => ${pos}`);
      sum = sum + Number(prices[pos]);
      // console.log(`sum => ${sum}`);
    }

    // --- main caculation loop
    while (len >= 0) {
      if (len > pos) {
        buffer[len - 1] = 0;

        len--;
      }
      else {
        sum = sum + Number(prices[pos]);
        buffer[pos] = sum / period;
        sum = sum - prices[pos + period - 1];
  
        pos--;
        len--;
      }
    }

    return buffer;
  },

  ema: (period, prices) => {
    let buffer = [];
    const pr = 2.0 / (period + 1);
    const len = prices.length - 2;
    let pos = len;

    while (pos >= 0) {
      if (pos === len) {
        buffer[pos + 1] = prices[pos + 1];
      }
      buffer[pos] = prices[pos] * pr + buffer[pos + 1] * (1 - pr);
      pos--;
    }

    return buffer;
  },

  macd: (fast, slow, signal, prices) => {
    let macd = [];
    let signals = [];
    const emaFast = self.ema(fast, prices);
    const emaSlow = self.ema(slow, prices);

    const len = prices.length;
    let pos = len;

    while (pos >= 0) {
      
      if (pos > len - slow) 
        macd[pos - 1] = 0;
      else
        macd[pos] = emaFast[pos] - emaSlow[pos];

      pos--;
    }

    signals = self.ema(8, macd);


    return [macd, signals];
  },
  bands: (period, width, prices, ma21) => {
    let stddev = [];
    const upperBand = [];
    const lowerBand = [];
    const len = ma21.length;

    stddev = self.standardDeviation(prices, ma21, period);      
    for (let i = 0; i < len; i++) {
      upperBand[i] = ma21[i] + width * stddev[i];
      lowerBand[i] = ma21[i] - width * stddev[i];
    }

    return {upperBand, lowerBand};
  },
  // Standard Deviation
  // position: int, prices: array, ma: array, period: int
  standardDeviation: (prices, ma, period) => {
    let stddev = [];

    let pos = prices.length;

    while (pos >= 0) {
      if (pos > ma.length - period) {
        stddev[pos - 1] = 0.0;
      } 
      else {
        let sdd = 0.0;
        for (let i = 0; i < period; i++) {
          sdd += Math.pow(prices[pos] - ma[pos], 2);
        }
        stddev[pos] = Math.sqrt(sdd / period);
      }
      pos--;
    }

    return stddev;
  }
};



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