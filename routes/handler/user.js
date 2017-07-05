var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

var USER = {
  addUser: function(req, res) {
    var name = req.query.name;
    var pwd = req.query.pwd;
    var user = {
      name: name,
      pwd: pwd,
      created: util.getRightDate(new Date().getTime())
    }
    if(!name || !pwd) {
      res.send({
        result: 'FALSE',
        data: '用户名或密码错误'
      })
      return false;
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermUSER');
      collection.insertMany([user], function(err, result) {
        assert.equal(err, null);
        db.close();
        res.send({
          result: 'TRUE',
          data: user
        });
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
  }
}

module.exports = USER;
