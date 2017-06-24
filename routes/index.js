/*global module*/
var express = require('express');
var router = express.Router();
;

//handlers
var XC = require('./handler/XC')
var TUNIU = require('./handler/TuNiu')
var MEITUAN = require('./handler/meituan')
var STATIC = require('./handler/static')
var ZDXSCLTZJL = require('./handler/zdxscltzjl')

router.get('/', function(req, res) {
  res.render('templates/index', {
    layout: '../static/templates/layout.ejs',
    err: '系统错误'
  });
});

//导入携程数据表,日期会转化为数字，使用时 var date = new Date(1900, 0, dateVal - 1);
router.post('/exportOrderXC', function(req, res) {
  XC.exportOrderXC(req, res);
})

//保存携程订单数据入数据库
router.post('/saveOrderXC', function(req, res) {
  XC.saveOrderXC(req, res);
})

//获取携程订单数据列表
router.get('/getOrderListXC', function(req, res) {
  XC.getOrderListXC(req, res)
})


//导入携程数据表,日期会转化为数字，使用时 var date = new Date(1900, 0, dateVal - 1);
router.post('/exportOrderTUNIU', function(req, res) {
  TUNIU.exportOrderTUNIU(req, res);
})

//保存携程订单数据入数据库
router.post('/saveOrderTUNIU', function(req, res) {
  TUNIU.saveOrderTUNIU(req, res);
})

//获取携程订单数据列表
router.get('/getOrderListTUNIU', function(req, res) {
  TUNIU.getOrderListTUNIU(req, res)
})

//获取美团数据
router.get('/getDataFromMeituan', function(req, res) {
  MEITUAN.getDataFromMeituan(req, res)
})

router.get('/getOrderListMEITUAN', function(req, res) {
  MEITUAN.getOrderListMEITUAN(req, res)
})


router.get('/getAdvanceDaysStatic', function(req, res){
  STATIC.getStaticData(req, res);
})

//重大销售策略调整记录表 路由
router.post('/saveZdxscltzjlItem', function(req, res) {
  ZDXSCLTZJL.saveZdxscltzjlItem(req, res);
})
router.get('/getZdxscltzjlList', function(req, res) {
  ZDXSCLTZJL.getZdxscltzjlList(req, res);
})
router.post('/getZdxscltzjlDetail', function(req, res) {
  ZDXSCLTZJL.getZdxscltzjlDetail(req, res);
})

module.exports = router;
