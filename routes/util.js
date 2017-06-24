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
      if(_hotel.indexOf(h.name) != -1) {
        __hotel = h.name;
      }
    })
    return __hotel;
  }
}


module.exports = util;
