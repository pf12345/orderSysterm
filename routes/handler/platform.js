var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');
var transliterate = require('transliteration');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var PLATFORM  = {
  addPlatform: function(req, res) {
    var name = req.body.data.name;
    var key = '';
    if(name) {
      key = transliterate.slugify(name).replace(/\-/ig, '');
    }
    var platform = {
      name: name,
      key: key,
      created: util.getRightDate(new Date().getTime())
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPLATFORM');
      collection.findOne({
        "name": name
      }, function(err, result) {
        if(result) {
          db.close();
          res.send({
            result: 'FALSE',
            data: result,
            message: '已有相关酒店'
          });
        }else {
          collection.insertMany([platform], function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: platform
            });
          });
        }
      });
    });
  },
  getPlatformList: function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPLATFORM');
      var cursor = collection.find({});
      cursor.count(function(err, count) {
        cursor.toArray(function(err, docs) {
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

  //删除
  deletePlatformItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPLATFORM');
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
  updatePlatformItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermPLATFORM');
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
              message: '修改失败，请刷新重试！'
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

module.exports = PLATFORM;
