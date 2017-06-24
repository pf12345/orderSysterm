var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var dburl = config.dbInfo.url;

var util = require('./../util');
var XC = require('./XC');
var MEITUAN = require('./meituan');

STATIC = {
  //提前预定天数统计
  getStaticData: function(req, res) {
    XC.getOrderListXCFromDB(function(XCdocs) {
      MEITUAN.getOrderListMEITUANFromDB(function(MTdocs) {
        var docs = XCdocs.concat(MTdocs);
        //提前预定天数统计
        var _advanceDaysArr = [];
        for(var i = 0; i < 60; i++) {
          _advanceDaysArr[i] = 0;
        }

        //连住天数统计
        var _stayDaysArr = [];
        for(var i = 0; i < 6; i++) {
          _stayDaysArr[i] = 0;
        }

        //24小时统计
        var _hoursArr = [];
        for(var i = 0; i < 24; i++) {
          _hoursArr[i] = 0;
        }


        docs.forEach(function(doc) {
          if(doc.advance_days) {
            _advanceDaysArr[doc.advance_days] += 1;
          }
          if(doc.stay_days) {
            _stayDaysArr[doc.stay_days] += 1;
          }
          if(doc.notice_hour) {
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
    })
  },
  //获取某年某月 每天各酒店订单数据
  getHotelDaysStatic: function(req, res) {
    XC.getOrderListXCFromDB(function(XCdocs) {
      MEITUAN.getOrderListMEITUANFromDB(function(MTdocs) {
        var docs = XCdocs.concat(MTdocs);


        res.send({
          result: 'TRUE',
          data: []
        })
      })
    })
  }
}



module.exports = STATIC;
