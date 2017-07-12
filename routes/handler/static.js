var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');
var _ = require('underscore');
var moment = require('moment');

// Connection URL
var dburl = config.dbInfo.url;

var util = require('./../util');
var XC = require('./XC');
var MEITUAN = require('./meituan');
var hotel = require('./../hotel');

STATIC = {
  getAllOrderListFromDB: function(queryStr, cb) {
    XC.getOrderListXCFromDB(function(XCdocs) {
      MEITUAN.getOrderListMEITUANFromDB(function(MTdocs) {
        var docs = XCdocs.concat(MTdocs);
        if(cb && typeof cb === 'function') {
          cb(docs);
        }
      }, queryStr)
    }, queryStr)
  },
  //提前预定天数统计
  getStaticData: function(req, res) {
    var start = req.body.start + ' 00:00:00',
      end = req.body.end + ' 23:59:59';
    var queryStr = {};
    queryStr.check_in_date = {
      $gte: start,
      $lte: end
    } //{"order_date":{$lt:50}}
    this.getAllOrderListFromDB(queryStr, function(docs) {
      //提前预定天数统计
      var _advanceDaysArr = [];
      for (var i = 0; i < 60; i++) {
        _advanceDaysArr[i] = 0;
      }

      //连住天数统计
      var _stayDaysArr = [];
      for (var j = 0; j < 6; j++) {
        _stayDaysArr[j] = 0;
      }

      //24小时统计
      var _hoursArr = [];
      for (var k = 0; k < 24; k++) {
        _hoursArr[k] = 0;
      }


      docs.forEach(function(doc) {
        if (doc.advance_days) {
          if(!_advanceDaysArr[doc.advance_days]) {
              _advanceDaysArr[doc.advance_days] = 0;
          }
          _advanceDaysArr[doc.advance_days] += 1;
        }
        if (doc.stay_days) {
          if(!_stayDaysArr[doc.stay_days]) {
              _stayDaysArr[doc.stay_days] = 0;
          }
          _stayDaysArr[doc.stay_days] += 1;
        }
        if (doc.notice_hour) {
          if(!_hoursArr[doc.notice_hour]) {
              _hoursArr[doc.notice_hour] = 0;
          }
          _hoursArr[doc.notice_hour] += 1;
        }
      })

      res.send({
        result: 'TRUE',
        data: {
          advanceDays: _advanceDaysArr,
          stayDays: _stayDaysArr,
          hourStatic: _hoursArr
        }
      })
    })
  },

  //获取某年某月 每天各酒店订单数据
  getHotelDaysStatic: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var queryStr = {};
    queryStr.order_date = {
      $gte: startTime,
      $lte: endTime
    } //{"order_date":{$lt:50}}
    this.getAllOrderListFromDB(queryStr, function(docs) {
      var daysArr = util.getDates(time);
      var _hotel_arr = _.extend([], hotel);
      _hotel_arr.forEach(function(_hotel) {
        _hotel.data = {};
        daysArr.forEach(function(day) {
          _hotel.data[day] = {
            weekday: util.getWeekDay(day),
            value: 0
          };
        })
      })
      _hotel_arr.forEach(function(_hotel) {
        for (var key in _hotel.data) {
          docs.forEach(function(doc) {
            if (moment(key) && moment(key).isSame && moment(key).isSame(doc.order_date.split(' ')[0], 'day') && _hotel.name == doc.hotel_short_name) {
              _hotel.data[key].value += 1;
            }
          })
        }
      })
      res.send({
        result: 'TRUE',
        data: _hotel_arr
      })
    })
  },
  //获取某年某月 每天各酒店订单间夜数据
  getHotelDaysRoomNightStatic: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var queryStr = {};
    queryStr.order_date = {
      $gte: startTime,
      $lte: endTime
    } //{"order_date":{$lt:50}}
    this.getAllOrderListFromDB(queryStr, function(docs) {
      var daysArr = util.getDates(time);
      var _hotel_arr = _.extend([], hotel);
      _hotel_arr.forEach(function(_hotel) {
        _hotel.data = {};
        daysArr.forEach(function(day) {
          _hotel.data[day] = {
            weekday: util.getWeekDay(day),
            value: 0
          };
        })
      })
      _hotel_arr.forEach(function(_hotel) {
        for (var key in _hotel.data) {
          docs.forEach(function(doc) {
            if (moment(key).isSame(doc.order_date.split(' ')[0], 'day') && _hotel.name == doc.hotel_short_name) {
              _hotel.data[key].value += (doc.room_nights || 0);
            }
          })
        }

      })
      res.send({
        result: 'TRUE',
        data: _hotel_arr
      })
    })
  },
  //获取本年到目前为止间夜数
  getYearToTodayRoomNights: function(req, res) {
    var startTime = moment().add(-1, 'days').format('YYYY') + '-1-1 00:00:00',
      endTime = moment().format('YYYY-M-D') + ' 23:59:59';
      var queryStr = {};
      queryStr.order_date = {
        $gte: startTime,
        $lte: endTime
      } //{"order_date":{$lt:50}}
      this.getAllOrderListFromDB(queryStr, function(docs) {
        var _hotel_arr = [];
        hotel.forEach(function(_hotel) {
          _hotel_arr.push(_.extend({}, _hotel))
        })
        var otherStrObject = {
          roomNightsTotalYear: 0 //年累计间夜
        };

        var totalRow = _.extend({
          name: '总计'
        }, otherStrObject);

        _hotel_arr.forEach(function(_hotel) {
          _.extend(_hotel, otherStrObject)
          docs.forEach(function(doc) {
            if (doc.hotel_short_name === _hotel.name) {
              _hotel.roomNightsTotalYear += Number(doc.room_nights || 0);
              totalRow.roomNightsTotalYear += Number(doc.room_nights || 0);
            }
          })
        })

        _hotel_arr.push(totalRow);

        res.send({
          result: 'TRUE',
          data: _hotel_arr
        })
      })
  },
  //获取昨日总间夜数、毛利、间夜数对比、毛利对比数据
  getYesterdayAndTodaydiff: function(req, res) {
    var startTime = moment().add(-1, 'days').format('YYYY-M-D') + ' 00:00:00',
      endTime = moment().format('YYYY-M-D') + ' 23:59:59';
      var queryStr = {};
      queryStr.order_date = {
        $gte: startTime,
        $lte: endTime
      } //{"order_date":{$lt:50}}
      this.getAllOrderListFromDB(queryStr, function(docs) {
        var _hotel_arr = [];
        hotel.forEach(function(_hotel) {
          _hotel_arr.push(_.extend({}, _hotel))
        })
        var otherStrObject = {
          roomNightsToday: 0, //今日总计间夜数
          grossProfitToday: 0, //今日总计毛利金额
          todayDate: moment().format('YYYY-M-DD'),
          yesterdayDate: moment().add(-1, 'days').format('YYYY-M-DD'),
          roomNightsYesterday: 0, //昨日总计间夜数
          grossProfitYesterday: 0, //昨日总计毛利金额
          roomNightsToYesAdd: 0, //间夜数对比昨日增加
          grossProfitToYesAdd: 0, //毛利金额对比昨日增加
          roomNightsAddPercent: 0, //间夜数+%
          grossProfitAddPercent: 0, //毛利金额+%
        };
        var totalRow = _.extend({
          name: '总计'
        }, otherStrObject);
        var left = new Date(moment().add(-1, 'days').format('YYYY-M-DD') + ' 00:00:00').getTime(),
          middle = new Date(moment().add(-1, 'days').format('YYYY-M-DD') + ' 23:59:59').getTime(),
          right = new Date(moment().format('YYYY-M-DD') + ' 23:59:59').getTime();
        _hotel_arr.forEach(function(_hotel) {
          _.extend(_hotel, otherStrObject)
          docs.forEach(function(doc) {
            if (doc.hotel_short_name === _hotel.name) {
              //昨天
              if(left < new Date(doc.order_date).getTime() && new Date(doc.order_date).getTime() <= middle) {
                _hotel.roomNightsYesterday += Number(doc.room_nights || 0);
                _hotel.grossProfitYesterday += Number(doc.money - doc.settlement);

                totalRow.roomNightsYesterday += Number(doc.room_nights || 0);
                totalRow.grossProfitYesterday += Number(doc.money - doc.settlement);
              } else if(middle < new Date(doc.order_date).getTime() && new Date(doc.order_date).getTime() <= right) {
                _hotel.roomNightsToday += Number(doc.room_nights || 0);
                _hotel.grossProfitToday += Number(doc.money - doc.settlement);

                totalRow.roomNightsToday += Number(doc.room_nights || 0);
                totalRow.grossProfitToday += Number(doc.money - doc.settlement);
              }
            }
          })
        })

        _hotel_arr.forEach(function(_hotel) {
          _hotel.roomNightsToYesAdd = Number(_hotel.roomNightsToday - _hotel.roomNightsYesterday);
          _hotel.grossProfitToYesAdd = Number(_hotel.grossProfitToday - _hotel.grossProfitYesterday);
          _hotel.roomNightsAddPercent = _hotel.roomNightsYesterday ? Math.round(_hotel.roomNightsToYesAdd / _hotel.roomNightsYesterday * 100) : 0;
          _hotel.grossProfitAddPercent = _hotel.grossProfitYesterday ? Math.round(_hotel.grossProfitToYesAdd / _hotel.grossProfitYesterday * 100) : 0;
        })

        totalRow.roomNightsToYesAdd = Number(totalRow.roomNightsToday - totalRow.roomNightsYesterday);
        totalRow.grossProfitToYesAdd = Number(totalRow.grossProfitToday - totalRow.grossProfitYesterday);
        totalRow.roomNightsAddPercent = totalRow.roomNightsYesterday ? Math.round(totalRow.roomNightsToYesAdd / totalRow.roomNightsYesterday * 100) : 0;
        totalRow.grossProfitAddPercent = totalRow.grossProfitYesterday ? Math.round(totalRow.grossProfitToYesAdd / totalRow.grossProfitYesterday * 100) : 0;

        _hotel_arr.push(totalRow);

        res.send({
          result: 'TRUE',
          data: _hotel_arr
        })
      })
  },
  //获取某年某月 每天各酒店离店数据
  getHotelCheckoutStatic: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var queryStr = {};
    queryStr.order_date = {
      $gte: startTime,
      $lte: endTime
    } //{"order_date":{$lt:50}}
    this.getAllOrderListFromDB(queryStr, function(docs) {
      var _hotel_arr = [];
      hotel.forEach(function(_hotel) {
        _hotel_arr.push(_.extend({}, _hotel))
      })
      var otherStrObject = {
        roomNights: 0, //间夜数
        totalAmount: 0, //总金额
        totalAmountPercent: 0, //总金额%
        totalSettlement: 0, //结算总额
        grossProfit: 0, //毛利金额
        grossProfitPercent: 0, //毛利金额%
        grossProfitAvg: 0, //间均毛利
        grossProfitRate: 0, //毛利率%
      };
      var totalRow = _.extend({
        name: '总计'
      }, otherStrObject);

      totalRow.totalAmountPercent = 100;
      totalRow.grossProfitPercent = 100;

      _hotel_arr.forEach(function(_hotel) {
        _.extend(_hotel, otherStrObject)
        docs.forEach(function(doc) {
          if (doc.hotel_short_name === _hotel.name) {
            _hotel.roomNights += Number(doc.room_nights || 0);
            _hotel.totalAmount += Number(doc.money);
            _hotel.totalSettlement += Number(doc.settlement);
            _hotel.grossProfit += Number(doc.money - doc.settlement);

            totalRow.roomNights += Number(doc.room_nights || 0);
            totalRow.totalAmount += Number(doc.money);
            totalRow.totalSettlement += Number(doc.settlement);
            totalRow.grossProfit += Number(doc.money - doc.settlement);
          }
        })
      })

      _hotel_arr.forEach(function(_hotel) {
        _hotel.totalAmountPercent = totalRow.totalAmount ? Math.round(_hotel.totalAmount / totalRow.totalAmount * 100) : 0;
        _hotel.grossProfitPercent = totalRow.grossProfit ? Math.round(_hotel.grossProfit / totalRow.grossProfit * 100) : 0;
        _hotel.grossProfitAvg = _hotel.roomNights ? Math.round(_hotel.grossProfit / _hotel.roomNights) : 0;
        _hotel.grossProfitRate = _hotel.totalAmount ? Math.round(_hotel.grossProfit / _hotel.totalAmount * 100) : 0;
        totalRow.grossProfitRate += _hotel.grossProfitRate;
        totalRow.grossProfitAvg += _hotel.grossProfitAvg;
      })

      totalRow.grossProfitRate = Math.round(totalRow.grossProfitRate / _hotel_arr.length);
      totalRow.grossProfitAvg = Math.round(totalRow.grossProfitAvg / _hotel_arr.length);

      _hotel_arr.push(totalRow);

      res.send({
        result: 'TRUE',
        data: _hotel_arr
      })
    })
  },
  //获取离店渠道统计
  getCheckoutDataChannelStatic: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var queryStr = {};
    queryStr.order_date = {
      $gte: startTime,
      $lte: endTime
    } //{"order_date":{$lt:50}}
    var _hotel_arr = [];
    hotel.forEach(function(_hotel) {
      _hotel_arr.push(_.extend({}, _hotel))
    })
    var _hotel_arr_names = [];
    hotel.forEach(function(_hotel) {
      _hotel_arr_names.push(_hotel.name);
    })
    _hotel_arr.push({
      name: '合计',
      name_all: '合计',
      key: 'total'
    })
    var channels = [{
      name: '携程',
      key: 'xc'
    }, {
      name: '美团',
      key: 'mt'
    }, {
      name: '途牛',
      key: 'tn'
    }, {
      name: '合计',
      key: 'total'
    }];
    var total_row = _hotel_arr[_hotel_arr.length - 1];
    _hotel_arr.forEach(function(_hotel) {
      channels.forEach(function(_channel) {
        _hotel[_channel.key] = {
          channel: _channel.name,
          order_number: 0, //订单量
          room_nights: 0, //间夜数
          order_number_percent: 0, //订单量％
          room_nights_percent: 0, //间夜数％
          grossProfitPercent: 0 //毛利额％
        }
      })
    })

    //根据数据库数据，计算相关值
    var setOrderAndNights = function(docs, type) {
      _hotel_arr.forEach(function(_hotel) {
        docs.forEach(function(doc) {
          if (doc.hotel_short_name == _hotel.name) {
            _hotel[type].order_number += 1;
            _hotel.total.order_number += 1;
            _hotel[type].room_nights += (doc.room_nights || 0);
            _hotel.total.room_nights += (doc.room_nights || 0);
          }
        })
      })
      docs.forEach(function(doc) {
        if (_hotel_arr_names.indexOf(doc.hotel_short_name) != -1) {
          total_row[type].order_number += 1;
          total_row.total.order_number += 1;
          total_row[type].room_nights += (doc.room_nights || 0);
          total_row.total.room_nights += (doc.room_nights || 0);
        }
      })
    }

    //计算总计数据
    var setTotalData = function(_hotel, type) {
      _hotel[type].order_number_percent = _hotel.total.order_number ? Math.round(_hotel[type].order_number / _hotel.total.order_number * 100) : 0;
      _hotel[type].room_nights_percent = _hotel.total.room_nights ? Math.round(_hotel[type].room_nights / _hotel.total.room_nights * 100) : 0;
    }

    XC.getOrderListXCFromDB(function(XCdocs) {
      setOrderAndNights(XCdocs, 'xc');
      MEITUAN.getOrderListMEITUANFromDB(function(MTdocs) {
        setOrderAndNights(MTdocs, 'mt');
        _hotel_arr.forEach(function(_hotel, _index) {
          setTotalData(_hotel, 'xc');
          setTotalData(_hotel, 'mt');
          if (_index < _hotel_arr.length - 1) {
            _hotel.total.order_number_percent = total_row.total.order_number ? Math.round(_hotel.total.order_number / total_row.total.order_number * 100) : 0;
            _hotel.total.room_nights_percent = total_row.total.room_nights ? Math.round(_hotel.total.room_nights / total_row.total.room_nights * 100) : 0;
          } else {
            _hotel.total.order_number_percent = 100;
            _hotel.total.room_nights_percent = 100;
          }
        })
        res.send({
          result: 'TRUE',
          data: _hotel_arr
        })
      }, queryStr)
    }, queryStr)
  },
  //亏损订单明细表
  getLossStatic: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var queryStr = {};
    queryStr = {
      'order_date': {
        $gte: startTime,
        $lte: endTime
      }
    }
    this.getAllOrderListFromDB(queryStr, function(docs) {
      var _docs = [];
      if(docs) {
        _docs = docs.filter(function(_doc) {
          if(_doc.money < _doc.settlement) {
            return true;
          }
          return false;
        })
      }
      res.send({
        result: 'TRUE',
        data: _docs,
        count: _docs.length
      });
    })
  }
}



module.exports = STATIC;
