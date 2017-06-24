var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var dataStructure = require('./../dataStructure')
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

TUNIU = {

  //保存途牛订单数据入数据库
  saveOrderTUNIU: function(req, res) {
    var item = req.body.data;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermTUNIU');
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

  //获取途牛订单数据列表
  getOrderListTUNIU: function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermTUNIU');
      collection.find().toArray(function(err, docs) {
        assert.equal(null, err);
        db.close();
        res.send({
          result: 'TRUE',
          data: docs
        });
      });
    });
  }
}

module.exports = TUNIU;
