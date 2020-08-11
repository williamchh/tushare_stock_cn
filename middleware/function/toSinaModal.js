var self = (module.exports = {
  ConverTushareToSinaModal: (tushare) => {},
  RenameObjectKey: (object, key, newKey) => {
    const clonedObj = self.clone(object);

    const targetKey = clonedObj[key];

    delete clonedObj[key];
    delete clonedObj["sma08"];
    delete clonedObj["sma13"];
    delete clonedObj["sma21"];
    delete clonedObj["ema21"];
    delete clonedObj["ema34"];
    delete clonedObj["macd"];
    delete clonedObj["signal"];
    delete clonedObj["stddv"];
    delete clonedObj["upper"];
    delete clonedObj["lower"];
    delete clonedObj["nextSum08"];
    delete clonedObj["nextSum13"];
    delete clonedObj["nextSum21"];
    clonedObj["volume"] = "0";

    clonedObj[newKey] = self.ConvertDatetimeStr(targetKey);

    return clonedObj;
  },

  clone: (obj) => {
    return Object.assign({}, obj);
  },

  ConvertDatetimeStr: (datestr) => {
    if (datestr.length == 8) {
      return (
        datestr.slice(0, 4) +
        "-" +
        datestr.slice(4, 6) +
        "-" +
        datestr.slice(6, 8)
      );
    } else {
      return (
        datestr.slice(0, 4) +
        "-" +
        datestr.slice(4, 6) +
        "-" +
        datestr.slice(6, 8) +
        " " +
        datestr.slice(8, 10) +
        ":" +
        datestr.slice(10, 12) +
        ":00"
      );
    }
  },
});
