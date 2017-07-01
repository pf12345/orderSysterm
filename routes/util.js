var moment = require('moment');
var hotel = require('./hotel');

util = {
  getRightDate: function(dateVal) {
    return moment(dateVal).format('YYYY-MM-DD HH:mm')
  },
  getRightDateHour: function(dateVal) {
    return moment(dateVal).hour()
  },
  //获取时间间隔
  getDiffDate: function(start, end, type) {
    var _start = moment(start);
    var _end = moment(end);
    var _diff = _start.diff(_end, type, true);

    return Math.ceil(Math.abs(_diff));
  },
  //获取酒店简称
  getHotelShortName: function(_hotel) {
    var __hotel = '';
    hotel.forEach(function(h) {
      if (_hotel.indexOf(h.name) != -1) {
        __hotel = h.name;
      }
    })
    return __hotel;
  },
  //获取某年某月天数数组  getDates("2012-02")
  getDates: function(yearMonth) {
    var days = moment(yearMonth, "YYYY-MM").daysInMonth(); //获取某月总天数
    var start = yearMonth + '-01';
    var daysArr = [start];
    for (var i = 1; i < days; i++) {
      var _day = moment(start).add(i, 'days').format('YYYY-MM-DD'); //本月1号后几天时间
      daysArr.push(_day)
    }
    return daysArr;
  },
  getWeekDay: function(day) {
    var num = moment(day).weekday();
    switch (num) {
      case 0:
        return '周日';
        break;
      case 1:
        return '周一';
        break;
      case 2:
        return '周二';
        break;
      case 3:
        return '周三';
        break;
      case 4:
        return '周四';
        break;
      case 5:
        return '周五';
        break;
      case 6:
        return '周六';
        break;
      default:
        return '';
    }
  }
}


module.exports = util;
