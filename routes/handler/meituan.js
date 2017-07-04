
var request = require('request');

var mongo = require('mongodb'),
  MongoClient = mongo.MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

var dataStructure = require('./../dataStructure');
var _ = require('underscore');

// Connection URL
var dburl = config.dbInfo.url;

var util = require('./../util');

MEITUAN = {
  initData: function(data) {
    var _arr = [];
    data.forEach(function(obj, index) {
      var _result = {}
      _.extend(_result, dataStructure.meituan);
      var _orderNum = ''; //订单号
      var _checkIn_date_init = '', //入住时间
        _checkOut_date_init = '', //离店时间
        _order_date = '', //下单时间 第11个
        _room_number = 0, //房间数
        _hotel = '', //酒店
        _room_type = '', //房型
        _custom_name = '', //入住人
        _money = '', //金额
        _hotel_confirm_number = '', //酒店确认号
        _nights = 0; //晚数


      for(var key in _result) {
        _result[key].value = obj[_result[key].meituan];
        //订单号
        if(_result[key].meituan == 'orderId') {
          _orderNum = obj[_result[key].meituan];
        }
        //酒店
        if(_result[key].meituan == 'poiName') {
          _hotel = obj[_result[key].meituan];
        }
        //房型
        if(_result[key].meituan == 'roomName') {
          _room_type = obj[_result[key].meituan];
        }
        //房间数
        if(_result[key].meituan == 'roomCount') {
          _room_number = obj[_result[key].meituan];
        }
        //晚数
        if(_result[key].meituan == 'priceInfo.length') {
          _result[key].value = obj.priceInfo.length;
          _nights = _result[key].value;
        }
        //入住人
        if(_result[key].meituan == 'guests.name') {
          _result[key].value = obj.guests[0].name;
          _custom_name = obj.guests[0].name;
        }
        if(['checkInDate', 'checkOutDate', 'bookingTime'].indexOf(_result[key].meituan) > -1) {
          _result[key].value = util.getRightDate(_result[key].value)
          //入住时间
          if(_result[key].meituan == 'checkInDate') {
            _checkIn_date_init = _result[key].value;
          }
          //离店时间
          if(_result[key].meituan == 'checkOutDate') {
            _checkOut_date_init = _result[key].value;
          }
          //下单时间
          if(_result[key].meituan == 'bookingTime') {
            _order_date = _result[key].value;
          }
        }

        //金额
        if(_result[key].meituan == 'price') {
          _result[key].value = _result[key].value / 100;
          _money = _result[key].value;
        }
      }


      _result.meituan = JSON.stringify(data);
      _arr.push({
        created: util.getRightDate(new Date().getTime()),
        platform: '美团',
        platform_en: 'meituan',
        data: JSON.stringify(_result),
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
        settlement: 100, //结算额
        hotel_confirm_number: _hotel_confirm_number, //酒店确认号
        nights: _nights, //晚数
        notice_hour: util.getRightDateHour(_order_date) //订单时间所属小时
      });
    })
    _arr.forEach(function(obj) {
      obj.data = JSON.parse(obj.data)
    })
    return _arr;
  },
  getDataFromMeituan: function(req, res) {
    var url = 'http://eb.meituan.com/api/v1/ebooking/orders?_token=eJx1kFtv2kAQhf%252FLvnYV7%252F3CGwkkNYUGjOsQVTzgCzZQ48iYQFL1v3fWMVEeEsuSP5%252BdOXN2%252FqLaT1GPEngoRs0BWFhtNWVCUG4wSj5onFoiCEZxHQ1Q7zflSmFlxdIpAQhvilZmiTsUcomZgNfV%252BFCCiqZ56nleFl%252BV2aY5rvZXSVXCr1fVaVYj%252FHXBqap3cbZPCgRmZejMjLWYEwldxkog7sgozKx1pGGyFY6Ewcy4U22BlNM0p5BLAynDgZgjyS7ESEfS6neiF1JwylviMI05F0kkEAUSEjTqZghCOuIuwRtRp7nMzLALaf0JuQ71TrbtgF7GW4LMrD119%252BWkJdulYhacuWgJ%252FLhyK9u5lcF31a6uG4T7UERdEMZabhs6%252FSNL5i5FgcGi6awOm3yPeigbnZqNHv4oBv1ZMPVu%252FfrB18Ejuxbj23wt%252B5PrJpn%252FfDkdaZYsmHcMB9FzsU3Tp7tZNblh47kMR4%252F3eXpWRfVrOLx5KV7zPH0w63ge6egwC%252F5khk13Qmb9cPU6sOV2sL%252BPgpgkzbd4FJ7X5zI5NJvxxF%252FcxbGel6Qsjqfvi9F2ukP%252F%252FgNzRrWI&filter=ALL&limit=1000&offset=0&orderId=&orderStatus=&orderType=4&partnerId=&phone=&poiId=&roomIds=';

    var token = '';

    var _this = this;

    request({
      headers: {
        'Cookie': token,
        "Host": 'eb.meituan.com'
      },
      uri: encodeURI(url),
      method: 'GET'
    }, function(error, response, body) {
      try{
        body = JSON.parse(body);
        if(body.status == 0 && body.data) {
          MongoClient.connect(dburl, function(err, db) {
            assert.equal(null, err);
            var collection = db.collection('ordersystermMEITUAN');
            if (body.data.results && body.data.results.length) {
              collection.insertMany(_this.initData(body.data.results), function(err, result) {
                assert.equal(err, null);
                db.close();
                res.send({
                  result: 'TRUE',
                  data: _this.initData(body.data.results)
                });
              });
            } else {
              res.send({
                result: 'FALSE',
                data: []
              });
            }

          });
        }
      }catch(e) {
        res.send({
          result: 'FALSE',
          data: e
        });
        console.log(e);
      }

    })
  },

  //保存美团订单数据入数据库
  saveOrderMEITUAN: function(req, res) {
    var item = req.body.data;
    var saveDatas = []; //保存入数据库数组

    if(item) {

      item.hotel_short_name = util.getHotelShortName(item.hotel);
      item.advance_days = util.getDiffDate(item.check_in_date, item.order_date, 'days');
      item.notice_hour = util.getRightDateHour(item.order_date);
      item.nights = item.stay_days;
      item.room_nights = item.room_number * item.stay_days;

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
      var collection = db.collection('ordersystermMEITUAN');
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

  getOrderListMEITUANFromDB: function(cb, queryStr, page, limit) {
    queryStr = queryStr || {};
    page = page || 1;
    limit = limit || 10000;

    MongoClient.connect(dburl, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermMEITUAN');
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
  getOrderListMEITUAN: function(req, res) {
    var listFilterKey = req.query.listFilterKey || 'order_date';
    var listFilterStartTime = (req.query.listFilterStartTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 00:00:00';
    var listFilterEndTime = (req.query.listFilterEndTime || new Date().toLocaleDateString().replace(/\//ig, '-')) + ' 23:59:59';
    var limit = Number(req.query.limit) || 20;
    var page = Number(req.query.page) || 1;
    var queryStr = {};
    queryStr[listFilterKey] = {$gte: listFilterStartTime,$lte: listFilterEndTime} //{"order_date":{$lt:50}}
    this.getOrderListMEITUANFromDB(function(docs, count) {
      res.send({
        result: 'TRUE',
        data: docs,
        count: count
      });
    }, queryStr, page, limit)
  },
  //获取数据
 getOrderDetailMEITUAN: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermMEITUAN');
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
 updateOrderMEITUANItem: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermMEITUAN');
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
 deleteOrderMEITUANitem: function(req, res) {
   var item_id = req.body._id;
   MongoClient.connect(dburl, function(err, db) {
     assert.equal(null, err);
     var collection = db.collection('ordersystermMEITUAN');
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


module.exports = MEITUAN;
