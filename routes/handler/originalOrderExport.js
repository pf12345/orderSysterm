var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');

var csv = require('fast-csv');

var dataStructure = require('./../dataStructure')
var _ = require('underscore');

var moment = require('moment');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var redisHander = require('./../../redisHander')

var XC = require('./XC')

//原始导入数据
ORIGINALEXPORT = {
  //导入携程数据
  exportOrderOriginal: function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var workSheetsFromFile = xlsx.parse(files.file[0].path);
      var save_excel_data = [];
      var _platform = '', //平台 0
        _orderNum = '', //订单号，第1个数据
        _hotel = '', //酒店 2
        _room_type = '', //房型 3
        _checkIn_date_init = '', //入住时间 4
        _checkOut_date_init = '', //离店时间 5
        _room_number = 0, //房间数 6
        _nights = 0, //晚数 7
        _custom_name = '', //入住人 8
        _order_date = '', //下单时间 9
        _money = '', //金额 10
        _order_status = '', //订单状态 11
        _order_type = '', //订单类型 12
        _hotel_confirm_number = '', //酒店确认号 13
        _billing_number = '', //发单单号 14
        _settlement = 0; //结算额 15

      if (workSheetsFromFile[0].data && workSheetsFromFile[0].data.length) {
        for (var i = 0, _i = workSheetsFromFile[0].data.length; i < _i; i++) {
          if (i > 0) {
            var item = workSheetsFromFile[0].data[i];
            _platform = item[0];
            _orderNum = item[1];
            _hotel = item[2];
            _room_type = item[3];
            _checkIn_date_init = item[4] ? moment(new Date(1900, 0, item[4])).format('YYYY-MM-DD') : '';
            _checkOut_date_init = item[5] ? moment(new Date(1900, 0, item[5])).format('YYYY-MM-DD') : '';
            _room_number = item[6];
            _nights = item[7];
            _custom_name = item[8];
            _order_date = item[9] ? moment(new Date(1900, 0, item[9])).format('YYYY-MM-DD') : '';
            _money = item[10];
            _order_status = item[11];
            _order_type = item[12];
            _hotel_confirm_number = item[13];
            _billing_number = item[14];
            _settlement = item[15];
            save_excel_data.push({
              created: util.getRightDate(new Date().getTime()),
              platform: _platform, //平台
              platform_en: _platform,
              order_number: _orderNum + '', //订单号
              hotel: _hotel, //酒店
              hotel_short_name: util.getHotelShortName(_hotel), //酒店简称
              room_type: _room_type, //房型
              custom_name: _custom_name, //入住人
              check_in_date: _checkIn_date_init, //入住时间
              check_out_date: _checkIn_date_init, //离店时间
              order_date: _checkIn_date_init, //下单时间
              stay_days: _nights, //入住天数
              advance_days: util.getDiffDate(_checkIn_date_init, _order_date, 'days'), //提前预定天数
              room_number: _room_number, //房间数
              room_nights: _room_number * _nights, //间夜数
              money: _money, //金额
              settlement: _settlement, //结算额
              nights: _nights, //晚数
              order_status: _order_status, //订单状态
              order_type: _order_type, //订单类型
              hotel_confirm_number: _hotel_confirm_number, //酒店确认号
              billing_number: _billing_number, //发单单号
              notice_hour: util.getRightDateHour(_order_date) //订单时间所属小时
            })
          }
        }
      }
      res.send({
        result: 'TRUE',
        data: save_excel_data
      });
    });
  },

  //保存携程订单数据入数据库
  saveOrderOriginal: function(req, res) {
    var saveDatas = []; //保存入数据库数组
    if (req.body.data) {
      req.body.data.forEach(function(_data) {
        if(_data) {
          saveDatas.push(_data);
        }
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOriginal');
      // Insert some documents
      if (req.body.data && req.body.data.length) {
        if (saveDatas && saveDatas.length) {
          collection.insertMany(saveDatas, function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: saveDatas
            });
          });
        } else {
          res.send({
            result: 'TRUE',
            data: []
          });
        }
      } else {
        res.send({
          result: 'FALSE',
          data: []
        });
      }
    });
  },
  //从数据库获取列表数据
  getOrderListOriginalFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOriginal');
      var cursor = collection.find(queryStr);
      cursor.count(function(err, count) {
        cursor.skip((page - 1) * limit).limit(limit).toArray(function(err, docs) {
          assert.equal(null, err);
          db.close();
          if (cb && typeof cb === 'function') {
            cb(docs, count);
          }
        });
      })
    });
  },
  //获取携程订单数据列表
  getOrderListOriginal: function(req, res) {
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    listFilterStartTime = util.getRightDate(listFilterStartTime);
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    listFilterEndTime = util.getRightDate(listFilterEndTime);

    var listFilterName = req.query.listFilterName || '';
    var listFilterHotelName = req.query.listFilterHotelName || '';
    var listFilterOrderNumber = req.query.listFilterOrderNumber || '';
    var listFilterBillingNumber = req.query.listFilterBillingNumber || '';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryAnd = [{
      custom_name: new RegExp(listFilterName)
    }, {
      hotel: new RegExp(listFilterHotelName)
    }, {
      order_number: new RegExp(listFilterOrderNumber)
    }, {
      billing_number: new RegExp(listFilterBillingNumber)
    }];
    if (listFilterKey && listFilterKey != 'no') {
      queryAnd.push({
        [listFilterKey]: {
          $gte: listFilterStartTime ? listFilterStartTime : '',
          $lte: listFilterEndTime ? listFilterEndTime : ''
        }
      })
    }
    var queryStr = {
      $and: queryAnd
    };
    // queryStr[listFilterKey] = {
    //   $gte: listFilterStartTime,
    //   $lte: listFilterEndTime
    // } //{"order_date":{$lt:50}}
    this.getOrderListOriginalFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },
  //获取当日价格监控记录簿数据
  getOrderDetailOriginal: function(req, res) {

    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOriginal');
      var o_id = new mongo.ObjectID(item_id);
      collection.findOne({
        "_id": o_id
      }, function(err, result) {
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    });
  },

  //修改结算金额
  updateOrderOriginalItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOriginal');
      var o_id = new mongo.ObjectID(item_id);
      // Update document where a is 2, set b equal to 1
      var _set = {};
      for (var key in req.body) {
        if (key != '_id') {
          _set[key] = req.body[key];
        }
      }

      if (_set.hotel) {
        _set.hotel_short_name = util.getHotelShortName(_set.hotel);
      }

      collection.updateOne({
        "_id": o_id
      }, {
        $set: _set
      }, function(err, result) {
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    })
  },

  //删除
  deleteOrderOriginalitem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOriginal');
      var o_id = new mongo.ObjectID(item_id);
      // Update document where a is 2, set b equal to 1
      collection.deleteOne({
        "_id": o_id
      }, {}, function(err, result) {
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    })
  },
  //同步以前数据
  updateData: function(req, res) {
    XC.getOrderListXCFromDB(function(docs, count) {
      var list = [];
      docs.forEach(function(doc) {
        if(doc) {
          list.push({
            created: doc.created,
            platform: doc.platform, //平台
            platform_en: doc.platform_en,
            order_number: doc.order_number, //订单号
            hotel: doc.hotel, //酒店
            hotel_short_name: doc.hotel_short_name, //酒店简称
            room_type: doc.room_type, //房型
            custom_name: doc.custom_name, //入住人
            check_in_date: doc.check_in_date, //入住时间
            check_out_date: doc.check_out_date, //离店时间
            order_date: doc.order_date, //下单时间
            stay_days: doc.stay_days, //入住天数
            advance_days: doc.advance_days, //提前预定天数
            room_number: doc.room_number, //房间数
            room_nights: doc.room_nights, //间夜数
            money: doc.money, //金额
            settlement: doc.settlement, //结算额
            nights: doc.nights, //晚数
            order_status: doc.order_status, //订单状态
            order_type: doc.order_type, //订单类型
            hotel_confirm_number: doc.hotel_confirm_number, //酒店确认号
            billing_number: doc.billing_number, //发单单号
            notice_hour: doc.notice_hour //订单时间所属小时
          })
        }
      })
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var collection = db.collection('ordersystermOriginal');
        collection.insertMany(list, function(err, result) {
          assert.equal(err, null);
          db.close();
          res.send({
            result: 'TRUE',
            data: list
          });
        });
      })
    })
  }
}

module.exports = ORIGINALEXPORT;
