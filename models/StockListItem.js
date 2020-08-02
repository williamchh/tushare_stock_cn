const mongoose = require("mongoose");

const StockListItemSchema = mongoose.Schema({
  //   _id: false,
  code: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  latestUpdate: {
    type: Date,
    require: true,
  },
  week: [
    {
      date: {
        type: String,
        require: true,
      },
      value: {
        type: Number,
        require: true,
      },
    },
  ],
  month: [
    {
      date: {
        type: String,
        require: true,
      },
      value: {
        type: Number,
        require: true,
      },
    },
  ],
});

module.exports = mongoose.model("stockListItem", StockListItemSchema);
