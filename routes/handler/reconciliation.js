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

var Reconciliation = {
  exportHotelOrders: function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      var workSheetsFromFile = xlsx.parse(files.file[0].path);
      // console.log(workSheetsFromFile);

      res.send({
        result: 'TRUE',
        data: workSheetsFromFile
      });
      return;

    });
  }
}

module.exports = Reconciliation;
