var _ = require('underscore');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

//重大销售策略调整记录表
var ZDXSCLTZJL = {

  //保存重大销售策略调整记录表数据入数据库
  saveZdxscltzjlItem: function(req, res) {
    var item = req.body.data;
    item.created = util.getRightDate(new Date().getTime());
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermZDXSCLTZJL');
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

  //获取重大销售策略调整记录表数据列表
  getZdxscltzjlList: function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermZDXSCLTZJL');
      collection.find().toArray(function(err, docs) {
        assert.equal(null, err);
        db.close();
        res.send({
          result: 'TRUE',
          data: docs
        });
      });
    });
  },

  //获取重大销售策略调整记录表数据
  getZdxscltzjlDetail: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermZDXSCLTZJL');
      var o_id = new mongo.ObjectID(item_id);
      collection.findOne({"_id": o_id}, function(err, result) {
        db.close();
        res.send({
          result: 'TRUE',
          data: result
        });
      });
    });
  }
}

module.exports = ZDXSCLTZJL;
