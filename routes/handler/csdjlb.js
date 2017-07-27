var _ = require('underscore');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var moment = require('moment');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

//测试单记录表
var CSDJLB = {

  //保存测试单记录表数据入数据库
  saveCsdjlbItem: function(req, res) {
    var item = req.body.data;
    item.created = util.getRightDate(new Date().getTime());
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermCSDJLB');
      // Insert some documents
      if(item) {
        collection.insertMany([item], function(err, result) {
          assert.equal(err, null);
          db.close();
          res.send({
            result: 'TRUE',
            data: item
          });
        });
      }else{
        res.send({
          result: 'FALSE',
          data: []
        });
      }

    });
  },

  //获取测试单记录表数据列表
  getCsdjlbList: function(req, res) {
    var start = req.body.start ? moment(req.body.start).format('YYYY-MM-DD') + ' 00:00:00' : '',
      end = req.body.end ? moment(req.body.end).format('YYYY-MM-DD') + ' 23:59:59' : '',
      hotel = req.body.hotel,
      page = req.body.page || 1,
      limit = req.body.limit || 10000;
    var queryStr = {};
    queryStr.created = {
      $gte: start,
      $lte: end
    } //{"order_date":{$lt:50}}
    if(hotel) {
      queryStr.hotel = {$regex: hotel, $options:'i'};
    }

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermCSDJLB');
      var cursor = collection.find(queryStr);
      cursor.count(function(err, count) {
        cursor.skip((page - 1) * limit).limit(limit).toArray(function(err, docs) {
          assert.equal(null, err);
          db.close();
          res.send({
            result: 'TRUE',
            data: docs,
            count: count
          });
        });
      })

    });

  },

  //获取测试单记录表数据
  getCsdjlbDetail: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermCSDJLB');
      var o_id = new mongo.ObjectID(item_id);
      collection.findOne({"_id": o_id}, function(err, result) {
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    });
  },

  //修改
  updateCsdjlbItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermCSDJLB');
      var o_id = new mongo.ObjectID(item_id);
      // Update document where a is 2, set b equal to 1
      var _set = {};
      for(var key in req.body) {
        if(key != '_id') {
          _set[key] = req.body[key];
        }
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
  deleteCsdjlbItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermCSDJLB');
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

module.exports = CSDJLB;
