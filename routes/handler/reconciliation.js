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
var STATIC = require('./static');

var Reconciliation = {
  exportHotelOrders: function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var workSheetsFromFile = xlsx.parse(files.file[0].path);
      // console.log(workSheetsFromFile);
      var lists = [];
      if(workSheetsFromFile[0].data && workSheetsFromFile[0].data.length) {
        for(var i = 0, _i = workSheetsFromFile[0].data.length; i < _i; i++) {
          var _item = workSheetsFromFile[0].data[i];
          if(i > 1 && _item && _item.length) {
            var _list = {};
            if(_item && _item[2]) {
                _list.hotel = _item[1] || '';
                _list.name = _item[2] || '';
                _list.billing_number = _item[3] || ''; //发单单号3
                _list.hotel_confirm_number = _item[4] || ''; //酒店确认号 4
                _list.check_in_date = _item[5] ? moment(util.getExcelDate(_item[5])).format('YYYY-MM-DD HH:mm:ss') : ''; //入住时间 第4个
                _list.check_out_date = _item[6] ? moment(util.getExcelDate(_item[6])).format('YYYY-MM-DD HH:mm:ss') : ''; //离店时间 第5个
                _list.nights = _item[7] || 0; //晚数 7
                _list.room_number = _item[8] || 0; //房间数 8
                _list.room_nights = _item[9] || 0; //间夜数 9
                _list.unit_settlement = _item[10] || 0; //结算单价 10
                _list.settlement = _item[11] || 0; //结算额 11
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
  saveHotelOrders: function(req, res) {
    var saveDatas = []; //保存入数据库数组
    if(req.body.data) {
      req.body.data.forEach(function(_data) {
        saveDatas.push(_data);
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermHotelOrders');
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
  getHotelOrdersFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermHotelOrders');
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
  getHotelOrdersList: function(req, res) {
    var _this = this;
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-MM-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-MM-DD') + ' 23:59:59';
    var queryStr = {};
    var page = req.body.page || 1;
    var limit = req.body.limit || 10000;
    queryStr = {
      'created': {
        $gte: startTime,
        $lte: endTime
      }
    }
    this.getHotelOrdersFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },

  getHotelOrdersDetail: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermHotelOrders');
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
  deleteHotelOrdersitem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermHotelOrders');
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

  getHotelOrderComparison: function(req, res) {
    var _this = this;
    var time = req.body.time;
    var startTime = moment(req.body.time + '-01').format('YYYY-M-DD') + ' 00:00:00';
    var endTime = moment(startTime).add(moment(time, "YYYY-MM").daysInMonth() - 1, 'days').format('YYYY-M-DD') + ' 23:59:59';
    var page = req.body.page || 1;
    var limit = req.body.limit || 10000;
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
      _this.getHotelOrdersFromDB(function(_docs, count) {
        var lists = [], $_docs = [];
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
        $_docs = lists.filter(function(_doc, _index) {
          if(page && limit) {
            if((_index < (page - 1) * limit) || (_index > page * limit - 1)) {
              return false;
            }
          }
          return true;
        })
        res.send({
          result: 'TRUE',
          data: $_docs,
          count: lists.length
        });
      }, queryStrOrders)
    })
  },

  updateData(req, res) {
    this.getHotelOrdersFromDB(function(docs, count) {
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var collection = db.collection('ordersystermHotelOrders');
        var number = 0;
        docs.forEach(function(doc, _index) {
          var o_id = new mongo.ObjectID(doc._id);
          var billing_number = doc.name;
          var name = doc.billing_number;
          collection.updateOne({
            "_id": o_id
          }, {
            $set: {
              billing_number: billing_number,
              name: name
            }
          }, function(err, result) {
            number++;
            if (number >= count) {
              db.close();
              res.send({
                result: 'TRUE',
              });
            }
          });
        })

      })
    }, {})
  }
}

module.exports = Reconciliation;
