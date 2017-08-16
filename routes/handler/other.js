
var request = require('request');
var transliterate = require('transliteration');
var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

var dataStructure = require('./../dataStructure');
var _ = require('underscore');

// Connection URL
var dburl = config.dbInfo.url;

var util = require('./../util');
OTHER = {
  //保存订单数据入数据库
  saveOrderOTHER: function(req, res) {
    var item = req.body.data;
    var saveDatas = []; //保存入数据库数组

    if(item) {
      if(item.platform) {
        item.platform_en = transliterate.slugify(item.platform).replace(/\-/ig, '');
      }
      item.hotel_short_name = util.getHotelShortName(item.hotel);
      item.advance_days = util.getDiffDate(item.check_in_date, item.order_date, 'days');
      item.notice_hour = util.getRightDateHour(item.order_date);
      item.nights = item.stay_days;
      item.room_nights = item.room_number * item.stay_days;
      item.created = util.getRightDate(new Date().getTime());
      item.check_in_date = util.getRightDate(item.check_in_date);
      item.check_out_date = util.getRightDate(item.check_out_date);
      item.order_date = util.getRightDate(item.order_date);

      //在redis里面去查找订单号
      redisHander.getValue('order_numbers', function(res) {
        var order_numbers = [];
        if(!res) {
          order_numbers = [];
        }else{
          order_numbers = JSON.parse(res.value)
        }
        if(order_numbers.indexOf(item.order_number) == -1) {
          saveDatas.push(item);
          order_numbers.push(item.order_number);
        }
        redisHander.setValue('order_numbers', {value: JSON.stringify(order_numbers)});
      })
    }
    MongoClient.connect(dburl, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermOther');
      // Insert some documents
      if(item) {
        if(saveDatas && saveDatas.length) {
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
            result: 'TRUE',
            data: []
          });
        }
      }else{
        res.send({
          result: 'FALSE',
          data: []
        });
      }

    });
  },

  getOrderListOTHERFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(dburl, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermOther');
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
  //获取美团订单数据列表
  getOrderListOTHER: function(req, res) {
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    listFilterStartTime = util.getRightDate(listFilterStartTime);
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    listFilterEndTime = util.getRightDate(listFilterEndTime);

    var listFilterName = req.query.listFilterName;
    var listFilterHotelName = req.query.listFilterHotelName;
    var listFilterOrderNumber = req.query.listFilterOrderNumber;
    var listFilterBillingNumber = req.query.listFilterBillingNumber;

    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryAnd = [{
      custom_name: new RegExp(listFilterName)
    }, {
      hotel: new RegExp(listFilterHotelName)
    }, {
      order_number: new RegExp(listFilterOrderNumber)
    }, {
      billing_number: new RegExp(listFilterBillingNumber)
    }];
    if(listFilterKey && listFilterKey != 'no') {
      queryAnd.push({
        [listFilterKey]: {
          $gte: listFilterStartTime,
          $lte: listFilterEndTime
        }
      })
    }
    var queryStr = {
      $and: queryAnd
    };
    // queryStr[listFilterKey] = {$gte: listFilterStartTime,$lte: listFilterEndTime} //{"order_date":{$lt:50}}
    this.getOrderListOTHERFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },
  //获取数据
 getOrderDetailOTHER: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermOther');
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
 updateOrderOTHERItem: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermOther');
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
 deleteOrderOTHERitem: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermOther');
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
 updateData: function(req, res) {
   this.getOrderListOTHERFromDB(function(docs, count) {
     MongoClient.connect(dburl, function(err, db) {
       assert.equal(null, err);
       var collection = db.collection('ordersystermOther');
       var number = 0;
       docs.forEach(function(doc, _index) {
         var o_id = new mongo.ObjectID(doc._id);
         collection.updateOne({
           "_id": o_id
         }, {
           $set: {
             check_in_date: util.getRightDate(doc.check_in_date),
             check_out_date: util.getRightDate(doc.check_out_date),
             order_date: util.getRightDate(doc.order_date)
           }
         }, function(err, result) {
           number ++;
           if(number >= count) {
             db.close();
             res.send({
               result: 'TRUE',
             });
           }
         });
       })

     })
   })
 }
}


module.exports = OTHER;
