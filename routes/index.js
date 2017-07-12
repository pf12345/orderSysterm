/*global module*/
var express = require('express');
var router = express.Router();


//handlers
var XC = require('./handler/XC')
var TUNIU = require('./handler/TuNiu')
var QUNAER = require('./handler/qunaer')
var TONGCHENG = require('./handler/tongcheng')
var MEITUAN = require('./handler/meituan')
var STATIC = require('./handler/static')
var ZDXSCLTZJL = require('./handler/zdxscltzjl')
var CSDJLB = require('./handler/csdjlb')
var DRJGJKJLB = require('./handler/drjgkjlb')
var UPLOAD = require('./handler/upload')
var USER = require('./handler/user')
var SCHEDULING = require('./handler/scheduling')
var Reconciliation = require('./handler/reconciliation')

/* GET home page. */
router.get('/', function (req, res) {
    if(!req.session.user) {
      res.redirect('/login');
    }else {
      res.render('templates/index', {
        user: JSON.stringify({
          name: req.session.user.name,
          jurisdictions: req.session.user.jurisdictions
        })
      })
    }
})
router.get('/login', function(req, res) {
  req.session.user = null;
  res.render('templates/login')
})


router.post('/addUser', function(req, res) {
  USER.addUser(req, res);
})
router.get('/getUserList', function(req, res) {
  USER.getUserList(req, res);
})
router.post('/deleteUserItem', function(req, res) {
  USER.deleteUserItem(req, res);
})
router.post('/updateUserItem', function(req, res) {
  USER.updateUserItem(req, res);
})
router.post('/loginSystem', function(req, res) {
  var name = req.body.name;
  var pwd = req.body.pwd;
  if(!name || !pwd) {
    res.send({
      result: 'FALSE',
      data: null,
      message: '用户名或密码错误'
    })
    return false;
  }
  USER.loginSystem(name, function(result) {
    if(result && result.pwd == pwd) {
        req.session.user = result;
        res.send({
          result: 'TRUE',
          data: result,
          message: '登录成功'
        });
    }else {
      res.send({
        result: 'FALSE',
        data: null,
        message: '用户名与密码不匹配'
      });
    }
  });
})

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

//获取携程订单数据详情
router.post('/getOrderDetailXC', function(req, res) {
  XC.getOrderDetailXC(req, res)
})

//修改携程订单数据结算金额
router.post('/updateOrderXCItem', function(req, res) {
  XC.updateOrderXCItem(req, res);
})
router.post('/deleteOrderXCitem', function(req, res) {
  XC.deleteOrderXCitem(req, res);
})



//保存途牛订单数据入数据库
router.post('/saveOrderTUNIU', function(req, res) {
  TUNIU.saveOrderTUNIU(req, res);
})
router.get('/getOrderListTUNIU', function(req, res) {
  TUNIU.getOrderListTUNIU(req, res)
})
router.post('/getOrderDetailTUNIU', function(req, res) {
  TUNIU.getOrderDetailTUNIU(req, res);
})
router.post('/updateOrderTUNIUItem', function(req, res) {
  TUNIU.updateOrderTUNIUItem(req, res);
})
router.post('/deleteOrderTUNIUitem', function(req, res) {
  TUNIU.deleteOrderTUNIUitem(req, res);
})

//保存去哪儿订单数据入数据库
router.post('/saveOrderQUNAER', function(req, res) {
  QUNAER.saveOrderQUNAER(req, res);
})
router.get('/getOrderListQUNAER', function(req, res) {
  QUNAER.getOrderListQUNAER(req, res)
})
router.post('/getOrderDetailQUNAER', function(req, res) {
  QUNAER.getOrderDetailQUNAER(req, res);
})
router.post('/updateOrderQUNAERItem', function(req, res) {
  QUNAER.updateOrderQUNAERItem(req, res);
})
router.post('/deleteOrderQUNAERitem', function(req, res) {
  QUNAER.deleteOrderQUNAERitem(req, res);
})

//保存同程订单数据入数据库
router.post('/saveOrderTONGCHENG', function(req, res) {
  TONGCHENG.saveOrderTONGCHENG(req, res);
})
router.get('/getOrderListTONGCHENG', function(req, res) {
  TONGCHENG.getOrderListTONGCHENG(req, res)
})
router.post('/getOrderDetailTONGCHENG', function(req, res) {
  TONGCHENG.getOrderDetailTONGCHENG(req, res);
})
router.post('/updateOrderTONGCHENGItem', function(req, res) {
  TONGCHENG.updateOrderTONGCHENGItem(req, res);
})
router.post('/deleteOrderTONGCHENGitem', function(req, res) {
  TONGCHENG.deleteOrderTONGCHENGitem(req, res);
})

//获取美团数据
router.post('/saveOrderMEITUAN', function(req, res) {
  MEITUAN.saveOrderMEITUAN(req, res);
})
router.get('/getDataFromMeituan', function(req, res) {
  MEITUAN.getDataFromMeituan(req, res)
})
router.get('/getOrderListMEITUAN', function(req, res) {
  MEITUAN.getOrderListMEITUAN(req, res)
})
router.post('/getOrderDetailMEITUAN', function(req, res) {
  MEITUAN.getOrderDetailMEITUAN(req, res);
})
router.post('/updateOrderMEITUANItem', function(req, res) {
  MEITUAN.updateOrderMEITUANItem(req, res);
})
router.post('/deleteOrderMEITUANitem', function(req, res) {
  MEITUAN.deleteOrderMEITUANitem(req, res);
})


//统计路由
router.post('/getAdvanceDaysStatic', function(req, res) {
  STATIC.getStaticData(req, res);
})
router.post('/getHotelDaysStatic', function(req, res) {
  STATIC.getHotelDaysStatic(req, res);
})
router.post('/getHotelDaysRoomNightStatic', function(req, res) {
  STATIC.getHotelDaysRoomNightStatic(req, res);
})
router.post('/getHotelCheckoutStatic', function(req, res) {
  STATIC.getHotelCheckoutStatic(req, res);
})
router.post('/getCheckoutDataChannelStatic', function(req, res) {
  STATIC.getCheckoutDataChannelStatic(req, res);
})
router.post('/getLossStatic', function(req, res) {
  STATIC.getLossStatic(req, res);
})
router.get('/getYesterdayAndTodaydiff', function(req, res) {
  STATIC.getYesterdayAndTodaydiff(req, res);
})
router.get('/getYearToTodayRoomNights', function(req, res) {
  STATIC.getYearToTodayRoomNights(req, res);
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

//测试单记录表 路由
router.post('/saveCsdjlbItem', function(req, res) {
  CSDJLB.saveCsdjlbItem(req, res);
})
router.get('/getCsdjlbList', function(req, res) {
  CSDJLB.getCsdjlbList(req, res);
})
router.post('/getCsdjlbDetail', function(req, res) {
  CSDJLB.getCsdjlbDetail(req, res);
})

//当日价格监控记录簿 路由
router.post('/saveDrjgkjlbItem', function(req, res) {
  DRJGJKJLB.saveDrjgkjlbItem(req, res);
})
router.get('/getDrjgkjlbList', function(req, res) {
  DRJGJKJLB.getDrjgkjlbList(req, res);
})
router.post('/getDrjgkjlbDetail', function(req, res) {
  DRJGJKJLB.getDrjgkjlbDetail(req, res);
})
router.post('/updateDrjgkjlbItem', function(req, res) {
  DRJGJKJLB.updateDrjgkjlbItem(req, res);
})

//保存测试单记录表图片
router.post('/uploadImageCsdjlb', function(req, res) {
  UPLOAD.csdjlb(req, res);
})

//排班
router.post('/addLocation', function(req, res) {
  SCHEDULING.addLocation(req, res);
})
router.get('/getOrderListLocation', function(req, res) {
  SCHEDULING.getOrderListLocation(req, res);
})
router.post('/deleteLocationItem', function(req, res) {
  SCHEDULING.deleteLocationItem(req, res);
})
router.post('/updateLocationItem', function(req, res) {
  SCHEDULING.updateLocationItem(req, res);
})
router.post('/getLocationStatic', function(req, res) {
  SCHEDULING.getLocationStatic(req, res);
})

//酒店对账
router.post('/exportHotelOrders', function(req, res) {
  Reconciliation.exportHotelOrders(req, res)
})
module.exports = router;
