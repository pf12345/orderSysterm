var moment = require('moment');

util = {
  getRightDate: function(dateVal) {
    var _date = new Date(1900, 0, 0, 0, 0, dateVal * 24 * 60 * 60);
    return moment(_date).format('YYYY-MM-DD HH:mm')
  },
  getRightDateHour: function(dateVal) {
    var _date = new Date(1900, 0, 0, 0, 0, dateVal * 24 * 60 * 60);
    return moment(_date).hour()
  },
  getgRightDateTime: function(date) {
    return new Date(1900, 0, 0, 0, 0, date * 24 * 60 * 60).getTime();
  },
  //获取时间间隔
  getDiffDate: function(start, end, type) {
    var _start = moment(this.getgRightDateTime(start));
    var _end = moment(this.getgRightDateTime(end));
    return _start.diff(_end, type, true);
  },
  //获取间夜数
  getRoomNights: function() {

  }
}


module.exports = util;
