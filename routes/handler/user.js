var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var USER = {
  addAdmin: function(req, res) {
    var user = {
      name: 'admin',
      pwd: 'admin',
      jurisdictions: [],
      created: util.getRightDate(new Date().getTime())
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
      collection.findOne({
        "name": name
      }, function(err, result) {
        if(result) {
          db.close();
          res.send({
            result: 'FALSE',
            data: result,
            message: '已有相关用户'
          });
        }else {
          collection.insertMany([user], function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: user
            });
          });
        }
      });
    });
  },
  addUser: function(req, res) {
    var name = req.body.data.name;
    var pwd = req.body.data.password;
    var jurisdictions = req.body.data.jurisdictions;
    var user = {
      name: name,
      pwd: pwd,
      jurisdictions: jurisdictions,
      created: util.getRightDate(new Date().getTime())
    }
    if(!name || !pwd) {
      res.send({
        result: 'FALSE',
        data: null,
        message: '用户名或密码错误'
      })
      return false;
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
      collection.findOne({
        "name": name
      }, function(err, result) {
        if(result) {
          db.close();
          res.send({
            result: 'FALSE',
            data: result,
            message: '已有相关用户'
          });
        }else {
          collection.insertMany([user], function(err, result) {
            assert.equal(err, null);
            db.close();
            res.send({
              result: 'TRUE',
              data: user
            });
          });
        }
      });
    });
  },
  loginSystem: function(name, cb) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
      collection.findOne({
        "name": name
      }, function(err, result) {
        db.close();
        if(cb && typeof cb == 'function') {
          if(err) {
            cb();
          }else{
            cb(result);
          }
        }
      });
    });
  },
  getUserList: function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
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
  deleteUserItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
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
  updateUserItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
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
              message: '修改账号失败，请刷新重试！'
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

module.exports = USER;
