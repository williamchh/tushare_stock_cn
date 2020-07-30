module.exports = {
    reverseArray: (array) => {
        return array.slice(0).reverse();
    },

    hasInArray:(weekly, wkDate) => {
        let has = false;
        const len = wkDate.length;
        let cnt = 0;
        while (!has && cnt < len) {
            if (wkDate[cnt] === weekly.date)
                has = true;
            cnt++;
        }

        return has;
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
        let oldestDate = arr[0]
        arr.forEach(d => {
            if(d < oldestDate) oldestDate = d;
        })
        return oldestDate;
    },

    arrGetDatesAndCodes: (arr) => {
        let date = []
        let ts_code = []
        arr.forEach(a => {
            date.push(a.start_date);
            ts_code.push(a.ts_code.trim())
        })
        return {date, ts_code};
    }
}