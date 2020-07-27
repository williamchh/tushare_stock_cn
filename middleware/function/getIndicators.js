module.exports = {
  sma: (period, prices) => {
    const len = prices.length;
    const buffer = [];

    let sum = 0;
    let pos = len - 1;

    // -- initial accumulation
    if (pos < period) {
      pos = period;
    }
    for (let i = 0; i < period - 1; i++, pos--) {
      console.log(`i => ${i} , pos => ${pos}`);
      sum = sum + Number(prices[pos]);
      console.log(`sum => ${sum}`);
    }

    // --- main caculation loop
    while (pos >= 0) {
      sum = sum + Number(prices[pos]);
      buffer[pos] = sum / period;
      sum = sum - prices[pos + period - 1];

      pos--;
    }

    return buffer;
  },
};
