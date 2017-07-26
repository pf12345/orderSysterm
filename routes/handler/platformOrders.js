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
          if(i > 1) {
            var _item = workSheetsFromFile[0].data[i];
            var _list = {};
            if(_item && _item[2]) {
                _list.name = _item[1] || '';
                _list.billing_number = _item[2] || ''; //发单单号2
                _list.hotel_confirm_number = _item[3] || ''; //酒店确认号 3
                _list.check_in_date = _item[4] ? moment(new Date(1900, 0, _item[4])).format('YYYY-M-D') : ''; //入住时间 第4个
                _list.check_out_date = _item[5] ? moment(new Date(1900, 0, _item[4])).format('YYYY-M-D') : ''; //离店时间 第5个
                _list.nights = _item[6] || 0; //晚数 6
                _list.room_number = _item[7] || 0; //房间数 7
                _list.room_nights = _item[8] || 0; //间夜数 8
                _list.unit_settlement = _item[9] || 0; //结算单价 9
                _list.settlement = _item[10] || 0; //结算额 10
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
      redisHander.getValue('platform_billing_numbers', function(res) {
        var billing_numbers = [];
        if(!res) {
          billing_numbers = [];
        }else{
          billing_numbers = JSON.parse(res.value)
        }
        req.body.data.forEach(function(_data) {
          if(billing_numbers.indexOf(_data.billing_number) == -1) {
            saveDatas.push(_data);
            billing_numbers.push(_data.billing_number);
          }
        })
        redisHander.setValue('platform_billing_numbers', {value: JSON.stringify(billing_numbers)});
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
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryStr = {};
    // queryStr[listFilterKey] = {$gte: listFilterStartTime,$lte: listFilterEndTime} //{"order_date":{$lt:50}}
    // console.log(queryStr);
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
        var lists = [];
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
        res.send({
          result: 'TRUE',
          data: lists,
          count: count
        });
      }, queryStrOrders)
    })
  }
}

module.exports = PlatformOrders;
