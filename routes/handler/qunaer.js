var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var dataStructure = require('./../dataStructure')
var _ = require('underscore');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

QUNAER = {

  //保存去哪儿订单数据入数据库
  saveOrderQUNAER: function(req, res) {
    var item = req.body.data;
    var saveDatas = []; //保存入数据库数组
    if (item) {
      item.hotel_short_name = util.getHotelShortName(item.hotel);
      item.advance_days = util.getDiffDate(item.check_in_date, item.order_date, 'days');
      item.notice_hour = util.getRightDateHour(item.order_date);
      item.nights = item.stay_days;
      item.room_nights = item.room_number * item.stay_days;
      item.created = util.getRightDate(new Date().getTime());

      //在redis里面去查找订单号
      redisHander.getValue('order_numbers', function(res) {
        var order_numbers = [];
        if (!res) {
          order_numbers = [];
        } else {
          order_numbers = JSON.parse(res.value)
        }
        if (order_numbers.indexOf(item.order_number) == -1) {
          saveDatas.push(item);
          order_numbers.push(item.order_number);
        }
        redisHander.setValue('order_numbers', {
          value: JSON.stringify(order_numbers)
        });
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermQUNAER');
      // Insert some documents
      if (item) {
        if (saveDatas && saveDatas.length) {
          collection.insertMany([item], function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: item
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

  getOrderListQUNAERFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermQUNAER');
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

  //获取去哪儿订单数据列表
  getOrderListQUNAER: function(req, res) {
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryStr = {};
    queryStr[listFilterKey] = {
      $gte: listFilterStartTime,
      $lte: listFilterEndTime
    } //{"order_date":{$lt:50}}
    this.getOrderListQUNAERFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit);

  },

  //获取数据
  getOrderDetailQUNAER: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermQUNAER');
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
  //修改
  updateOrderQUNAERItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermQUNAER');
      var o_id = new mongo.ObjectID(item_id);
      // Update document where a is 2, set b equal to 1
      var _set = {};
      for(var key in req.body) {
        if(key != '_id') {
          _set[key] = req.body[key];
        }
      }

      if(_set.hotel) {
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
  deleteOrderQUNAERitem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermQUNAER');
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
  }
}

module.exports = QUNAER;
