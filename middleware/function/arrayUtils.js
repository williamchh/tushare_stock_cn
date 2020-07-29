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

    groupByNum: (arr, n) => {
        var group = [];
        for (var i = 0, end = arr.length / n; i < end; ++i)
          group.push(arr.slice(i * n, (i + 1) * n));
        return group;
      }
}