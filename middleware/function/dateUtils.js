var self = module.exports = {
    getWeekNumber:(dateStr) => {
        const dateArr = self.dateString(dateStr);
        let d = new Date(dateArr);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
        return [d.getFullYear(), weekNo];
      },

      weeksInYear : (year) => {
        var d = new Date(year, 11, 31);
        var week = self.getWeekNumber(d)[1];
        return week == 1 ? 52 : week;
      },
      
      dateString : (strDate) => {
        const y = strDate.substring(0, 4);
        const m = strDate.substring(4, 6);
        const d = strDate.substring(6, 8);
        if (strDate.length === 8) {
            return y+"-"+m+"-"+d+"T00:00:00";
        } else {
            const h = strDate.substring(8, 10);
            const mn = strDate.substring(10, 12);
            const s = strDate.substring(12, 14);
              return y+"-"+m+"-"+d+"T"+h+":"+mn+":"+s;
        }
    } 
      
    }
        