var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var SCHEDULING = {
  //签到
  addLocation: function(req, res) {
    var item = req.body.data;
    item.created = util.getRightDate(new Date().getTime());
    item.check_date = item.check_date ? (item.check_date + ' ' + new Date().toTimeString().split(' ')[0]) : item.check_date;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermSCHEDULING');
      collection.insertMany([item], function(err, result) {
        assert.equal(err, null);
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    });
  },
  getOrderListSCHEDULINGFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermSCHEDULING');
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

  getOrderListLocation: function(req, res) {
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryStr = {};
    queryStr['check_date'] = {
      $gte: listFilterStartTime,
      $lte: listFilterEndTime
    } //{"order_date":{$lt:50}}
    this.getOrderListSCHEDULINGFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit);
  },

  //删除
  deleteLocationItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermSCHEDULING');
      var o_id = new mongo.ObjectID(item_id);
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

  //修改
  updateLocationItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermSCHEDULING');
      var o_id = new mongo.ObjectID(item_id);
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
          if(err) {
            res.send({
              result: 'TRUE',
              data: null,
              message: '修改数据失败，请刷新重试！'
            });
          } else {
            res.send({
              result: 'TRUE',
              data: result
            });
          }
        });
    })
  },
}

module.exports = SCHEDULING;
