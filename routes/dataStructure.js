var structrue = {};

structrue.xc = {
  'order_umber': {
    name: '订单号',
    value: ''
  },
  'jd_name': {
    name: '酒店',
    value: ''
  },
  'jd_id': {
    name: '酒店id',
    value: ''
  },
  'city': {
    name: '城市',
    value: ''
  },
  'room_type': {
    name: '房型',
    value: ''
  },
  'room_type_id': {
    name: '售卖房型id',
    value: ''
  },
  'check_in_date': {
    name: '入住日期',
    value: ''
  },
  'leave_date': {
    name: '离店日期',
    value: ''
  },
  'room_number': {
    name: '房间数',
    value: ''
  },
  'night_number': {
    name: '晚数',
    value: ''
  },
  'custom_name': {
    name: '入住人',
    value: ''
  },
  'order_date': {
    name: '下单日期',
    value: ''
  },
  'currency': {
    name: '币种',
    value: ''
  },
  'total_amount': {
    name: '总金额',
    value: ''
  },
  'order_status': {
    name: '订单状态',
    value: ''
  },
  'order_type': {
    name: '订单类型',
    value: ''
  },
  'hotel_confirm_number': {
    name: '酒店确认号',
    value: ''
  },
  'special_require': {
    name: '特殊要求',
    value: ''
  },
  'distributor': {
    name: '分销商',
    value: ''
  },
  'billing_status': {
    name: '发单到酒店ebooking状态',
    value: ''
  },
  'billing_number': {
    name: '发单单号',
    value: ''
  },
  'billing_total_amount': {
    name: '发单到酒店采购价总额',
    value: ''
  },
  'hotel_return_status': {
    name: '酒店回传状态',
    value: ''
  },
  'settlement_method': {
    name: '与酒店结算方式',
    value: ''
  },
  'confirm_method': {
    name: '确认方式',
    value: ''
  },
  'is_timeout': {
    name: '是否超时',
    value: ''
  },
  'is_retain_room': {
    name: '是否保留房',
    value: ''
  },
  'is_free_sale': {
    name: '是否FREESALE',
    value: ''
  }
}

structrue.TuNiu = {
  'order_number': {
    name: '订单号',
    value: ''
  },
  'order_type': {
    name: '确认单类型',
    value: ''
  },
  'order_status': {
    name: '确认状态',
    value: ''
  },
  'source_type': {
    name: '资源类型',
    value: ''
  },
  'source_number': {
    name: '资源编号',
    value: ''
  },
  'source_name': {
    name: '资源名称',
    value: ''
  },
  'product_number': {
    name: '产品编号',
    value: ''
  },
  'product_name': {
    name: '产品名称',
    value: ''
  },
  'source_tuanqi': {
    name: '资源团期',
    value: ''
  },
  'check_in_date': {
    name: '出游日期',
    value: ''
  },
  'room_number': {
    name: '数量',
    value: ''
  },
  'adult_price': {
    name: '成人结算价',
    value: ''
  },
  'child_price': {
    name: '儿童结算价',
    value: ''
  },
  'total_cost': {
    name: '总成本',
    value: ''
  },
  'custom_name': {
    name: '联系人姓名',
    value: ''
  },
  'custom_phone': {
    name: '联系人电话',
    value: ''
  },
  'room_person_name': {
    name: '出游人姓名',
    value: ''
  },
  'city': {
    name: '出发城市',
    value: ''
  },
  'tuniu_remarks': {
    name: '途牛备注',
    value: ''
  },
  'remarks': {
    name: '途牛备注',
    value: ''
  },
  'operation_personnel': {
    name: '运营人员',
    value: ''
  }
}

structrue.meituan = {
  'order_umber': {
    name: '订单号',
    value: '',
    meituan: 'orderId'
  },
  'jd_name': {
    name: '酒店',
    value: '',
    meituan: 'poiName'
  },
  'room_type': {
    name: '房型',
    value: '',
    meituan: 'roomName'
  },
  'check_in_date': {
    name: '入住日期',
    value: '',
    meituan: 'checkInDate'
  },
  'leave_date': {
    name: '离店日期',
    value: '',
    meituan: 'checkOutDate'
  },
  'room_number': {
    name: '房间数',
    value: '',
    meituan: 'roomCount'
  },
  'night_number': {
    name: '晚数',
    value: '',
    meituan: 'priceInfo.length'
  },
  'custom_name': {
    name: '入住人',
    value: '',
    meituan: 'guests.name'
  },
  'order_date': {
    name: '下单日期',
    value: '',
    meituan: 'bookingTime'
  },
  'total_amount': {
    name: '总金额',
    value: '',
    meituan: 'price'
  }
}

module.exports = structrue;
