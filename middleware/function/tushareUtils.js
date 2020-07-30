
var self = module.exports = {
    tushareID: () => {
        return "64db66258b8f9484488e13958907082fe21aa6e58716cbe333de8b28";
    },
    config: () => {
        return {
            headers: {
                "Content-Type": "application/json",
            },
        }
    },

    paramsWithOutDate: (codes) => {
        return {
            api_name: "daily",
            token: self.tushareID(),
            params: {
                ts_code: codes,
            },
            fields: "ts_code, trade_date, open, high, low, close",
        }
    },

    paramsWithDate: (ts_code, start_date, end_date) => {
        return {
            api_name: "daily",
            token: self.tushareID(),
            params: {
                ts_code: codeString(ts_code),
                start_date,
                end_date
            },
            fields: "ts_code, trade_date, open, high, low, close",
        }
    }
}

function codeString(arr) {
    let str = "";
    arr.forEach(a => str += `${a},`);
    return str.slice(0, str.length-1);
}