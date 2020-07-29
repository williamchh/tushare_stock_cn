const mongoose = require("mongoose");

const CandleSchema = mongoose.Schema({
  code: {
    type: String,
    require: true,
    unique: true,
  },
  updateDate:{
    type: Date
  },
  values: [
    {
      hourly: {
        date: {
          type: String,
          require: true,
        },
        open: {
          type: Number,
          require: true,
        },
        high: {
          type: Number,
          require: true,
        },
        low: {
          type: Number,
          require: true,
        },
        close: {
          type: Number,
          require: true,
        },
        sma08: {
          type: Number,
          require: true,
        },
        sma13: {
          type: Number,
          require: true,
        },
        sma21: {
          type: Number,
          require: true,
        },
        ema21: {
          type: Number,
          require: true,
        },
        ema34: {
          type: Number,
          require: true,
        },
        macd: {
          type: Number,
          require: true,
        },
        signal: {
          type: Number,
          require: true,
        },
        stddv: {
          type: Number,
          require: true,
        },
        upper: {
          type: Number,
          require: true,
        },
        lower: {
          type: Number,
          require: true,
        },
      },
      daily: {
        date: {
          type: String,
          require: true,
        },
        open: {
          type: Number,
          require: true,
        },
        high: {
          type: Number,
          require: true,
        },
        low: {
          type: Number,
          require: true,
        },
        close: {
          type: Number,
          require: true,
        },
        sma08: {
          type: Number,
          require: true,
        },
        sma13: {
          type: Number,
          require: true,
        },
        sma21: {
          type: Number,
          require: true,
        },
        ema21: {
          type: Number,
          require: true,
        },
        ema34: {
          type: Number,
          require: true,
        },
        macd: {
          type: Number,
          require: true,
        },
        signal: {
          type: Number,
          require: true,
        },
        stddv: {
          type: Number,
          require: true,
        },
        upper: {
          type: Number,
          require: true,
        },
        lower: {
          type: Number,
          require: true,
        },
      },
      weekly: {
        date: {
          type: String,
          require: true,
        },
        open: {
          type: Number,
          require: true,
        },
        high: {
          type: Number,
          require: true,
        },
        low: {
          type: Number,
          require: true,
        },
        close: {
          type: Number,
          require: true,
        },
        sma08: {
          type: Number,
          require: true,
        },
        sma13: {
          type: Number,
          require: true,
        },
        sma21: {
          type: Number,
          require: true,
        },
        ema21: {
          type: Number,
          require: true,
        },
        ema34: {
          type: Number,
          require: true,
        },
        macd: {
          type: Number,
          require: true,
        },
        signal: {
          type: Number,
          require: true,
        },
        stddv: {
          type: Number,
          require: true,
        },
        upper: {
          type: Number,
          require: true,
        },
        lower: {
          type: Number,
          require: true,
        },
      },
      monthly: {
        date: {
          type: String,
          require: true,
        },
        open: {
          type: Number,
          require: true,
        },
        high: {
          type: Number,
          require: true,
        },
        low: {
          type: Number,
          require: true,
        },
        close: {
          type: Number,
          require: true,
        },
        sma08: {
          type: Number,
          require: true,
        },
        sma13: {
          type: Number,
          require: true,
        },
        sma21: {
          type: Number,
          require: true,
        },
        ema21: {
          type: Number,
          require: true,
        },
        ema34: {
          type: Number,
          require: true,
        },
        macd: {
          type: Number,
          require: true,
        },
        signal: {
          type: Number,
          require: true,
        },
        stddv: {
          type: Number,
          require: true,
        },
        upper: {
          type: Number,
          require: true,
        },
        lower: {
          type: Number,
          require: true,
        },
      },
    },
  ],
});

module.exports = mongoose.model("Candle", CandleSchema);
