var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');

var csv = require('fast-csv');

var dataStructure = require('./../dataStructure')
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var config = require('./../../config/config.json');

// Connection URL
var url = config.dbInfo.url;
var util = require('./../util');

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
                    _hotel_confirm_number = '', //酒店确认号 16
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
                    nights: _nights, //晚数
                    hotel_confirm_number: _hotel_confirm_number, //酒店确认号
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
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      // console.log("Connected correctly to server");
      var collection = db.collection('ordersystermXC');
      // Insert some documents
      if (req.body.data && req.body.data.length) {
        collection.insertMany(req.body.data, function(err, result) {
          assert.equal(err, null);
          db.close();
          res.send({
            result: 'TRUE',
            data: req.body.data
          });
        });
      } else {
        res.send({
          result: 'FALSE',
          data: []
        });
      }

    });
  },
  //从数据库获取列表数据
  getOrderListXCFromDB: function(cb) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection('ordersystermXC');
      collection.find().toArray(function(err, docs) {
        assert.equal(null, err);
        db.close();
        if (cb && typeof cb === 'function') {
          cb(docs);
        }
      });
    });
  },
  //获取携程订单数据列表
  getOrderListXC: function(req, res) {
    this.getOrderListXCFromDB(function(docs) {
      res.send({
        result: 'TRUE',
        data: docs
      });
    })
  }
}

module.exports = XC;
