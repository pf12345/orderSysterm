var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');

var csv = require('fast-csv');

var moment = require('moment');

var dataStructure = require('./../dataStructure')
var _ = require('underscore');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var redisHander = require('./../../redisHander')

var PlatformOrders = {
  exportPlatformOrders: function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var workSheetsFromFile = xlsx.parse(files.file[0].path);
      // console.log(workSheetsFromFile);
      var lists = [];
      if(workSheetsFromFile[0].data && workSheetsFromFile[0].data.length) {
        for(var i = 0, _i = workSheetsFromFile[0].data.length; i < _i; i++) {
          var _item = workSheetsFromFile[0].data[i];
          if(i > 0 && _item && _item.length) {
            var _list = {};
            if(_item && _item[2]) {
                _list.order_number = _item[0] || '';
                _list.city = _item[1] || '';
                _list.hotel = _item[2] || '';
                _list.room_type = _item[3] || '';
                _list.check_in_date = _item[4] ? moment(util.getExcelDate(_item[4])).format('YYYY-MM-DD HH:mm:ss') : ''; //入住时间 第4个
                _list.check_out_date = _item[5] ? moment(util.getExcelDate(_item[5])).format('YYYY-MM-DD HH:mm:ss') : ''; //离店时间 第5个
                _list.room_number = _item[6] || 0; //房间数 6
                _list.nights = _item[7] || 0; //晚数 7
                _list.money = _item[8] || 0;
                _list.settlement = _item[10] || 0; //结算额 10
                _list.name = _item[11] || ''; //入住人
                _list.order_status = _item[12] || ''; //订单状态
                _list.settlement_status = _item[13] || ''; //结算状态
                _list.order_date = _item[14] ? moment(util.getExcelDate(_item[14])).format('YYYY-MM-DD HH:mm:ss') : '';
                _list.room_nights = _list.room_number * _list.nights; //间夜数 8
                _list.created = util.getRightDate(new Date().getTime());
                lists.push(_list);
            }
          }
        }
      }
      res.send({
        result: 'TRUE',
        data: lists
      });
    });
  },
  //保存订单数据入数据库
  savePlatformOrders: function(req, res) {
    var saveDatas = []; //保存入数据库数组
    if(req.body.data) {
      //在redis里面去查找订单号
      req.body.data.forEach(function(_data) {
        if(_data) {
          saveDatas.push(_data);
        }
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermPlatformOrders');
      // Insert some documents
      if (req.body.data && req.body.data.length) {
        if(saveDatas && saveDatas.length) {
          collection.insertMany(saveDatas, function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: saveDatas
            });
          });
        }else{
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
  getPlatformOrdersFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPlatformOrders');
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
  //获取订单数据列表
  getPlatformOrdersList: function(req, res) {
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-MM-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-MM-DD') + ' 23:59:59';
    var queryStr = {};
    var page = req.body.page || 1;
    var limit = req.body.limit || 10000;
    queryStr = {
      'created': {
        $gte: startTime,
        $lte: endTime
      }
    }
    this.getPlatformOrdersFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },

  getPlatformOrdersDetail: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPlatformOrders');
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
  //删除
  deletePlatformOrdersitem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPlatformOrders');
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

  getPlatformOrdersComparison: function(req, res) {
    var _this = this;
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var page = req.body.page || 1;
    var limit = req.body.limit || 10000;
    var queryStr = {};
    queryStr = {
      'order_date': {
        $gte: startTime,
        $lte: endTime
      }
    }
    var queryStrOrders = {};
    queryStrOrders = {
      'created': {
        $gte: moment(startTime).subtract(20, 'days').format('YYYY-MM-DD') + ' 00:00:00',
        $lte: moment(endTime).add(20, 'days').format('YYYY-MM-DD') + ' 23:59:59'
      }
    }
    STATIC.getAllOrderListFromDB(queryStr, function(docs) {
      _this.getPlatformOrdersFromDB(function(_docs, count) {
        var lists = [], $_docs = [];
        _docs.forEach(function(_doc) {
          docs.forEach(function(doc) {
            if(_doc.billing_number == doc.billing_number) {
              if(_doc.settlement != doc.settlement) {
                _doc.isError = true;
              }else {
                _doc.isError = false;
              }
              _doc.systemSettlement = doc.settlement;
              lists.push(_doc);
            }
          })
        })
        $_docs = lists.filter(function(_doc, _index) {
          if(page && limit) {
            if((_index < (page - 1) * limit) || (_index > page * limit - 1)) {
              return false;
            }
          }
          return true;
        })
        res.send({
          result: 'TRUE',
          data: $_docs,
          count: lists.length
        });
      }, queryStrOrders)
    })
  }
}

module.exports = PlatformOrders;
