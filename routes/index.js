/*global module*/
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var _ = require('underscore');
var request = require('request');
var fs = require('fs');
var multiparty = require('multiparty');
var xlsx = require('node-xlsx');
var dataStructure = require('./dataStructure');
var config = require('./../config/config.json');

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = config.dbInfo.url;

router.get('/', function(req, res) {
  res.render('templates/index', {
    layout: '../static/templates/layout.ejs',
    err: '系统错误'
  });
});

//导入携程数据表,日期会转化为数字，使用时 var date = new Date(1900, 0, dateVal - 1);
router.post('/exportOrderXC', function(req, res) {
  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(files.file[0].path));

    var file_name = workSheetsFromBuffer[0].name;
    var file_data = workSheetsFromBuffer[0].data;
    var keys = [];
    for (var key in dataStructure.xc) {
      keys.push(key);
    }
    var save_excel_data = [];
    if (file_data && file_data.length) {
      file_data.forEach(function(row, index) {
        if (index !== 0) {
          if (row.length) {
            var rowDefault = {};
            _.extend(rowDefault, dataStructure.xc);
            row.forEach(function(value, _index) {
              rowDefault[keys[_index]].value = value;
            })
            save_excel_data.push({
              created: new Date().getTime(),
              from: '携程',
              from_en: 'xc',
              file_name: file_name,
              data: rowDefault
            });
          }
        }
      })
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      var collection = db.collection('ordersystermXC');
      // Insert some documents
      collection.insertMany(save_excel_data, function(err, result) {
        assert.equal(err, null);
        db.close();
        res.send({
          result: 'TRUE',
          data: save_excel_data
        });
      });
    });
    console.log(file_name);
    console.log(JSON.stringify(save_excel_data));
  });

})

module.exports = router;
