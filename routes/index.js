/*global module*/
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var _ = require('underscore');
var request = require('request');
var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var dataStructure = require('./dataStructure');
var config = require('./../config/config.json');
var util = require('./util');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = config.dbInfo.url;

router.get('/', function(req, res) {
  res.render('templates/index', {
    layout: '../static/templates/layout.ejs',
    err: '系统错误'
  });
});

//导入携程数据表,日期会转化为数字，使用时 var date = new Date(1900, 0, dateVal - 1);
router.post('/exportOrderXC', function(req, res) {
  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(files.file[0].path));

    var file_name = workSheetsFromBuffer[0].name;
    var file_data = workSheetsFromBuffer[0].data;
    var keys = [];

    for (var key in dataStructure.xc) {
      keys.push(key);
    }
    var save_excel_data = [];
    if (file_data && file_data.length) {
      file_data.forEach(function(row, index) {
        if (index !== 0) {
          if (row.length) {
            var rowDefault = {};
            var _orderNum = ''; //订单号，第二个数据
            var _checkIn_date_init = '', //入住时间 第8个
            _checkOut_date_init = '', //离店时间 第9个
            _notice_date_init = ''; //通知时间 第10个
            var _room_number = 0; //房间数
            _.extend(rowDefault, dataStructure.xc);
            row.forEach(function(value, _index) {
              rowDefault[keys[_index]].value = value;
              if(_index == 2) {
                _orderNum = value;
              }
              if(_index == 8) {
                _checkIn_date_init = value;
              }
              if(_index == 9) {
                _checkOut_date_init = value;
              }
              if(_index == 10) {
                _notice_date_init = value;
              }
              if(_index == 11) {
                _room_number = value;
              }
            })
            save_excel_data.push({
              created: new Date().getTime(),
              from: '携程',
              from_en: 'xc',
              file_name: file_name,
              data: rowDefault,
              order_umber: _orderNum, //订单号
              check_in_date: util.getRightDate(_checkIn_date_init), //入住时间
              check_out_date: util.getRightDate(_checkOut_date_init), //离店时间
              notice_date: util.getRightDate(_notice_date_init), //通知时间
              stay_days: util.getDiffDate(_checkOut_date_init, _checkIn_date_init, 'days'), //入住天数
              advance_days: util.getDiffDate(_checkIn_date_init, _notice_date_init, 'days'), //提前预定天数
              room_number: _room_number, //房间数
              room_nights: _room_number * util.getDiffDate(_checkOut_date_init, _checkIn_date_init, 'days'), //间夜数
              notice_hour: util.getRightDateHour(_notice_date_init) //订单时间所属小时
            });
            res.send({
              result: 'TRUE',
              data: save_excel_data
            });
          }
        }
      })
    }
    // console.log(file_name);
    // console.log(JSON.stringify(save_excel_data));
  });
})

router.post('/saveOrderXC', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    // console.log("Connected correctly to server");
    var collection = db.collection('ordersystermXC');
    // Insert some documents
    if(req.body.data && req.body.data.length) {
      collection.insertMany(req.body.data, function(err, result) {
        assert.equal(err, null);
        db.close();
        res.send({
          result: 'TRUE',
          data: req.body.data
        });
      });
    }else{
      res.send({
        result: 'FALSE',
        data: []
      });
    }

  });
})

router.get('/getOrderListXC', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection('ordersystermXC');
    collection.find().toArray(function(err, docs) {
      assert.equal(null, err);
      db.close();
      res.send({
        result: 'TRUE',
        data: docs
      });
    });
  });
})

module.exports = router;
