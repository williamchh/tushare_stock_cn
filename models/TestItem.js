const mongoose = require("mongoose");

const TestItemSchema = mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  latest: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("testItem", TestItemSchema);
