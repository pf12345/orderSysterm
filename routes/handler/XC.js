var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');

var csv = require('fast-csv');

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

XC = {
  //导入携程数据
  exportOrderXC: function(req, res) {



    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      var stream = fs.createReadStream(files.file[0].path);
      var file_data = [];
      var csvStream = csv()
        .on("data", function(data) {
          file_data.push(data);
        })
        .on("end", function() {
          var keys = [];

          for (var key in dataStructure.xc) {
            keys.push(key);
          }
          var save_excel_data = [];
          if (file_data && file_data.length) {
            file_data.forEach(function(row, index) {
              if (index !== 0) {
                // console.log(row);
                if (row.length) {
                  var rowDefault = {};
                  var _orderNum = ''; //订单号，第0个数据
                  var _checkIn_date_init = '', //入住时间 第6个
                    _checkOut_date_init = '', //离店时间 第7个
                    _order_date = '', //下单时间 第11个
                    _room_number = 0, //房间数 8
                    _hotel = '', //酒店 1
                    _room_type = '', //房型 4
                    _custom_name = '', //入住人 10
                    _money = '', //金额
                    _settlement = 0, //结算额
                    _hotel_confirm_number = '', //酒店确认号 16
                    _billing_number = '', //发单单号
                    _nights = 0; //晚数
                  _.extend(rowDefault, dataStructure.xc);
                  row.forEach(function(value, _index) {
                    rowDefault[keys[_index]].value = value;
                    if (_index == 0) {
                      _orderNum = value;
                    }
                    if (_index == 1) {
                      _hotel = value;
                    }
                    if (_index == 4) {
                      _room_type = value;
                    }
                    if (_index == 6) {
                      _checkIn_date_init = value;
                    }
                    if (_index == 7) {
                      _checkOut_date_init = value;
                    }
                    if (_index == 8) {
                      _room_number = value;
                    }
                    if (_index == 9) {
                      _nights = value;
                    }
                    if (_index == 10) {
                      _custom_name = value;
                    }
                    if (_index == 11) {
                      _order_date = value;
                    }
                    if (_index == 13) {
                      _money = value;
                    }
                    if (_index == 16) {
                      _hotel_confirm_number = value;
                    }
                    if(_index == 20) {
                      _billing_number = value;
                    }
                    if(_index == 21) {
                      _settlement = value;
                    }

                  })
                  save_excel_data.push({
                    created: util.getRightDate(new Date().getTime()),
                    platform: '携程', //平台
                    platform_en: 'xc',
                    data: JSON.stringify(rowDefault),
                    order_number: _orderNum, //订单号
                    hotel: _hotel, //酒店
                    hotel_short_name: util.getHotelShortName(_hotel), //酒店简称
                    room_type: _room_type, //房型
                    custom_name: _custom_name, //入住人
                    check_in_date: _checkIn_date_init, //入住时间
                    check_out_date: _checkOut_date_init, //离店时间
                    order_date: _order_date, //下单时间
                    stay_days: _nights, //入住天数
                    advance_days: util.getDiffDate(_checkIn_date_init, _order_date, 'days'), //提前预定天数
                    room_number: _room_number, //房间数
                    room_nights: _room_number * _nights, //间夜数
                    money: _money, //金额
                    settlement: _settlement, //结算额
                    nights: _nights, //晚数
                    hotel_confirm_number: _hotel_confirm_number, //酒店确认号
                    billing_number: _billing_number, //发单单号
                    notice_hour: util.getRightDateHour(_order_date) //订单时间所属小时
                  });
                }
              }
            })
          }
          save_excel_data.forEach(function(obj) {
            obj.data = JSON.parse(obj.data)
          })
          res.send({
            result: 'TRUE',
            data: save_excel_data
          });
          console.log("done");
        });

      stream.pipe(csvStream);


      // res.send('ok');
      return;

    });
  },

  //保存携程订单数据入数据库
  saveOrderXC: function(req, res) {
    var saveDatas = []; //保存入数据库数组
    if(req.body.data) {
      //在redis里面去查找订单号
      redisHander.getValue('order_numbers', function(res) {
        var order_numbers = [];
        if(!res) {
          order_numbers = [];
        }else{
          order_numbers = JSON.parse(res.value)
        }
        req.body.data.forEach(function(_data) {
          if(order_numbers.indexOf(_data.order_number) == -1) {
            saveDatas.push(_data);
            order_numbers.push(_data.order_number);
          }
        })
        redisHander.setValue('order_numbers', {value: JSON.stringify(order_numbers)});
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermXC');
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
  getOrderListXCFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermXC');
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
  //获取携程订单数据列表
  getOrderListXC: function(req, res) {
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryStr = {};
    queryStr[listFilterKey] = {$gte: listFilterStartTime,$lte: listFilterEndTime} //{"order_date":{$lt:50}}
    // console.log(queryStr);
    this.getOrderListXCFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },
  //获取当日价格监控记录簿数据
  getOrderDetailXC: function(req, res) {

    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermXC');
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

  //修改结算金额
  updateOrderXCItem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermXC');
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
  deleteOrderXCitem: function(req, res) {
    var item_id = req.body._id;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermXC');
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

module.exports = XC;
