<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Button type="ghost" icon="ios-cloud-upload-outline" @click="show_add">新建</Button>
          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div class="item">
        <Radio-group v-model="listFilterKey">
          <Radio label="check_out_date">
              <span>离店日期</span>
          </Radio>
          <Radio label="check_in_date">
              <span>入住日期</span>
          </Radio>
        </Radio-group>
        <Date-picker v-model="listFilterStartTime" type="date" placeholder="开始时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <span>至</span>
        <Date-picker v-model="listFilterEndTime" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <Input v-model="listFilterName" placeholder="请输入姓名" style="width: 200px;margin: 5px"></Input>
        <Input v-model="listFilterHotelName" placeholder="请输入酒店名称" style="width: 200px;margin: 5px"></Input>
        <Input v-model="listFilterOrderNumber" placeholder="请输入订单号" style="width: 200px;margin: 5px"></Input>
        <Input v-model="listFilterBillingNumber" placeholder="请输入发单号" style="width: 200px;margin: 5px"></Input>
        <Button type="info" @click="listFilter">查询</Button>
      </div>
      <Table :height="tableHeight" :columns="columns" :data="data" @on-row-click="gotoDetail"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="total" :current="page" :page-size="limit" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑订单</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
          <Form-item label="平台" prop="platform">
              <Select v-model="editFormItem.platform" placeholder="请选择平台">
                  <Option v-for="platform in platforms" :value="platform.name" :key="platform.key">{{platform.name}}</Option>

              </Select>
          </Form-item>
        <Form-item label="订单号" prop="order_number">
            <Input v-model="editFormItem.order_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="发单单号" prop="billing_number">
            <Input v-model="formItem.billing_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店名称" prop="hotel">
            <Select v-model="editFormItem.hotel" placeholder="请选择酒店名称">
                <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

            </Select>
        </Form-item>
        <Form-item label="房型名称" prop="room_type">
            <Input v-model="editFormItem.room_type" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="预定日期">
            <Row>
                <Col span="11">
                  <Form-item>
                      <Date-picker type="date" placeholder="选择日期" v-model="editFormItem.order_date_day"></Date-picker>
                  </Form-item>

                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <Form-item>
                        <Time-picker type="time" placeholder="选择时间" v-model="editFormItem.order_date_time"></Time-picker>
                    </Form-item>

                </Col>
            </Row>
        </Form-item>
        <Form-item label="入住日期">
            <Date-picker type="date" placeholder="选择日期" v-model="editFormItem.check_in_date"></Date-picker>
        </Form-item>
        <Form-item label="离店日期">
            <Date-picker type="date" placeholder="选择日期" v-model="editFormItem.check_out_date"></Date-picker>
        </Form-item>
        <Form-item label="间数" prop="room_number">
            <Input v-model="editFormItem.room_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="晚数" prop="stay_days">
            <Input v-model="editFormItem.stay_days" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="入住人姓名" prop="custom_name">
            <Input v-model="editFormItem.custom_name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="应收金额" prop="money">
            <Input v-model="editFormItem.money" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="结算金额" prop="settlement">
            <Input v-model="editFormItem.settlement" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店预定号" prop="hotel_confirm_number">
            <Input v-model="editFormItem.hotel_confirm_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitEdit('editFormItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
        </Form-item>
    </Form>
      </div>
    </left-page>

    <left-page :show="showAdd" @on-close="close">
      <span slot="title">新建订单</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="平台" prop="platform">
              <Select v-model="formItem.platform" placeholder="请选择平台">
                  <Option v-for="platform in platforms" :value="platform.name" :key="platform.key">{{platform.name}}</Option>

              </Select>
          </Form-item>

        <Form-item label="订单号" prop="order_number">
            <Input v-model="formItem.order_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="发单单号" prop="billing_number">
            <Input v-model="formItem.billing_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店名称" prop="hotel">
            <Select v-model="formItem.hotel" placeholder="请选择酒店名称">
                <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

            </Select>
        </Form-item>
        <Form-item label="房型名称" prop="room_type">
            <Input v-model="formItem.room_type" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="预定日期">
            <Row>
                <Col span="11">
                  <Form-item prop="order_date_day">
                      <Date-picker type="date" placeholder="选择日期" v-model="formItem.order_date_day"></Date-picker>
                  </Form-item>

                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <Form-item prop="order_date_time">
                        <Time-picker type="time" placeholder="选择时间" v-model="formItem.order_date_time"></Time-picker>
                    </Form-item>

                </Col>
            </Row>
        </Form-item>
        <Form-item label="入住日期" prop="check_in_date">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.check_in_date"></Date-picker>
        </Form-item>
        <Form-item label="离店日期" prop="check_out_date">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.check_out_date"></Date-picker>
        </Form-item>
        <Form-item label="间数" prop="room_number">
            <Input v-model="formItem.room_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="晚数" prop="stay_days">
            <Input v-model="formItem.stay_days" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="入住人姓名" prop="custom_name">
            <Input v-model="formItem.custom_name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="应收金额" prop="money">
            <Input v-model="formItem.money" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="结算金额" prop="settlement">
            <Input v-model="formItem.settlement" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店预定号" prop="hotel_confirm_number">
            <Input v-model="formItem.hotel_confirm_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">订单详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>订单号</h4>
          <p>{{detail.order_number}}</p>
        </div>
        <div class="item">
          <h4>发单单号</h4>
          <p>{{detail.billing_number}}</p>
        </div>
        <div class="item">
          <h4>酒店</h4>
          <p>{{detail.hotel}}</p>
        </div>
        <div class="item">
          <h4>房型</h4>
          <p>{{detail.room_type}}</p>
        </div>
        <div class="item">
          <h4>入住日期</h4>
          <p>{{detail.check_in_date ? detail.check_in_date.split(' ')[0] : ''}}</p>
        </div>
        <div class="item">
          <h4>离店日期</h4>
          <p>{{detail.check_out_date ? detail.check_out_date.split(' ')[0] : ''}}</p>
        </div>
        <div class="item">
          <h4>房间数</h4>
          <p>{{detail.room_number}}</p>
        </div>
        <div class="item">
          <h4>晚数</h4>
          <p>{{detail.stay_days}}</p>
        </div>
        <div class="item">
          <h4>间夜数</h4>
          <p>{{detail.room_nights}}</p>
        </div>
        <div class="item">
          <h4>入住人</h4>
          <p>{{detail.custom_name}}</p>
        </div>
        <div class="item">
          <h4>下单日期</h4>
          <p>{{detail.order_date}}</p>
        </div>
        <div class="item">
          <h4>总金额</h4>
          <p>{{detail.money}}</p>
        </div>
        <div class="item">
          <h4>结算金额</h4>
          <p>{{detail.settlement}}</p>
        </div>
        <div class="item">
          <h4>酒店确认号</h4>
          <p>{{detail.hotel_confirm_number}}</p>
        </div>
      </div>
    </left-page>
  </div>
</template>
<style media="screen" scoped>
  .export {
    position: absolute;
    right: 0;
    top: 10px;
    line-height: 1;
    display: inline-block;
  }
  .item {
    margin: 0 0 20px 10px;
  }
  .addContent {
    padding: 20px 20px 20px 10px;
    position: absolute;
    top: 50px;
    width: 100%;
    left: 0;
    bottom: 0;
    overflow: auto;
  }
  .detailTitle {
    position: relative;
    display: inline-block;
    width: 550px;
  }
  .detailTitle span {
    position: absolute;
    right: 10px;
  }
</style>
<script>
    import axios from 'axios'
    import leftPage from './leftPage';
    export default {
        data () {
            return {
                showModal: false,
                showDetail: false,
                showEdit: false,
                tableHeight: '',
                showAdd: false,
                listFilterKey: 'check_out_date',
                listFilterStartTime: this.$root.getLocalDate(),
                listFilterEndTime: this.$root.getLocalDate(),
                listFilterName: '', //姓名
                listFilterHotelName: '', //酒店名
                listFilterOrderNumber: '', //订单号
                listFilterBillingNumber: '', //发单号
                limit: 20,
                page: 1,
                total: 0,
                detail: {},
                editFormItem: {},
                hotels: [],
                platforms: [],
                ruleEditValidate: {
                  platform: [
                    { required: true, message: '平台不能为空', trigger: 'change' }
                  ],
                  order_number: [
                    { required: true, message: '订单号不能为空', trigger: 'change' }
                  ],
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  room_type: [
                    { required: true, message: '房型不能为空', trigger: 'change' }
                  ],
                  room_number: [
                    { required: true, message: '间数不能为空', trigger: 'change' }
                  ],
                  stay_days: [
                    { required: true, message: '晚数不能为空', trigger: 'change' }
                  ],
                  custom_name: [
                    { required: true, message: '入住人不能为空', trigger: 'change' }
                  ],
                  money: [
                    { required: true, message: '应收金额不能为空', trigger: 'change' }
                  ],
                  settlement: [
                    { required: true, message: '结算不能为空', trigger: 'change' }
                  ],
                  hotel_confirm_number: [
                    { required: true, message: '酒店预订号不能为空', trigger: 'change' }
                  ],
                  billing_number: [
                    { required: true, message: '发单单号不能为空', trigger: 'change' }
                  ]
                },
                defaultItem: {
                    order_number: '',
                    hotel: '',
                    hotel_short_name: '',
                    room_type: '',
                    check_in_date: '',
                    check_out_date: '',
                    room_number: '',
                    stay_days: '',
                    custom_name: '',
                    order_date_time: '',
                    order_date_day: '',
                    order_date: '',
                    money: '',
                    nights: '',
                    settlement: '',
                    hotel_confirm_number: '',
                    notice_hour: '',
                    platform: '',
                    billing_number: ''
                },
                formItem: Object.assign({}, this.defaultItem),
                ruleValidate: {
                  platform: [
                    { required: true, message: '平台不能为空', trigger: 'change' }
                  ],
                  order_number: [
                    { required: true, message: '订单号不能为空', trigger: 'change' }
                  ],
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  room_type: [
                    { required: true, message: '房型不能为空', trigger: 'change' }
                  ],
                  check_in_date: [
                    { required: true, type: 'date', message: '入住时间不能为空', trigger: 'change' }
                  ],
                  check_out_date: [
                    { required: true, type: 'date', message: '离店时间不能为空', trigger: 'change' }
                  ],
                  room_number: [
                    { required: true, message: '间数不能为空', trigger: 'change' }
                  ],
                  stay_days: [
                    { required: true, message: '晚数不能为空', trigger: 'change' }
                  ],
                  custom_name: [
                    { required: true, message: '入住人不能为空', trigger: 'change' }
                  ],
                  order_date_time: [
                    { required: true, type: 'date', message: '下单日期不能为空', trigger: 'change' }
                  ],
                  order_date_day: [
                    { required: true, type: 'date', message: '下单时间不能为空', trigger: 'change' }
                  ],
                  money_ys: [
                    { required: true, message: '应收金额不能为空', trigger: 'change' }
                  ],
                  money_js: [
                    { required: true, message: '结算不能为空', trigger: 'change' }
                  ],
                  hotel_confirm_number: [
                    { required: true, message: '酒店预订号不能为空', trigger: 'change' }
                  ],
                  billing_number: [
                    { required: true, message: '发单单号不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '订单号',
                        width: 120,
                        key: 'order_number',
                        // fixed: 'left'
                    },
                    {
                        title: '发单单号',
                        width: 120,
                        key: 'billing_number',
                        // fixed: 'left'
                    },
                    {
                        title: '酒店名称',
                        width: 150,
                        key: 'hotel',

                    },
                    {
                        title: '房型名称',
                        width: 120,
                        key: 'room_type'
                    },
                    {
                        title: '预定日期',
                        width: 180,
                        key: 'order_date'
                    },
                    {
                        title: '入住日期',
                        width: 180,
                        key: 'check_in_date',
                        render(h, {row, column, index}) {
                          return `${row.check_in_date.split(' ')[0]}`
                        }
                    },
                    {
                        title: '离店日期',
                        width: 180,
                        key: 'check_out_date',
                        render(h, {row, column, index}) {
                          return `${row.check_out_date.split(' ')[0]}`
                        }
                    },
                    {
                        title: '间数',
                        width: 80,
                        key: 'room_number'
                    },
                    {
                        title: '晚数',
                        width: 80,
                        key: 'stay_days'
                    },
                    {
                        title: '入住人姓名',
                        width: 150,
                        key: 'custom_name'
                    },
                    {
                        title: '应收金额',
                        width: 120,
                        key: 'money'
                    },
                    {
                        title: '结算金额',
                        width: 200,
                        key: 'settlement'
                    },
                    {
                        title: '酒店预定号',
                        width: 120,
                        key: 'hotel_confirm_number'
                    },
                    {
                      title: '',
                      key: 'zhanwei'
                    }
                ],
                data: [],
                previewData: [],
                exportData: []
            }
        },
        created() {
          this.listFilter();
          this.getHotelList();
          this.getPlatformList();
        },
        methods: {
          listFilter() {
            let _this = this;
            this.$root.ajaxGet({
              funName: 'getOrderListOTHER',
              params: {
                listFilterKey: this.listFilterKey,
                limit: this.limit,
                page: this.page,
                listFilterStartTime: this.$root.getLocalDate(this.listFilterStartTime),
                listFilterEndTime: this.$root.getLocalDate(this.listFilterEndTime),
                listFilterName: this.listFilterName, //姓名
                listFilterHotelName: this.listFilterHotelName, //酒店名
                listFilterOrderNumber: this.listFilterOrderNumber, //订单号
                listFilterBillingNumber: this.listFilterBillingNumber
              }
            }, function(res, initRes) {
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          getHotelList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res) {
              _this.hotels = res
            })
          },
          getPlatformList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getPlatformList'
            }, function(res) {
              _this.platforms = res
            })
          },
          changePage(value) {
            this.page = value;
            this.listFilter();
          },
          editItem() {
            this.editFormItem = Object.assign({},this.detail);
            this.editFormItem.order_date_day = this.editFormItem.order_date.split(' ')[0];
            this.editFormItem.order_date_time = this.editFormItem.order_date.split(' ')[1];
            this.showEdit = true;
            this.showDetail = false;
          },
          cancelEdit() {
            this.showEdit = false;
          },
          submitEdit(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                let _this = this;
                this.$root.ajaxPost({
                  funName: 'updateOrderOTHERItem',
                  params: _this.editFormItem
                }, function(res) {
                  _this.$Message.info('修改成功');
                  _this.showEdit = false;
                  _this.gotoDetail(_this.detail);
                  _this.listFilter();
                })
              } else {
                this.$Message.error('请输入相关数据!');
              }
            })
          },
          deleteItem() {
            let _this = this;
            this.$Modal.confirm({
              title: '确认信息',
              content: '确认删除此数据？',
              onOk() {
                _this.$root.ajaxPost({
                  funName: 'deleteOrderOTHERitem',
                  params: {
                    _id: _this.detail._id
                  }
                }, function(res) {
                  _this.showDetail = false;
                  _this.listFilter();
                })
              }
            });
          },
          closeEdit() {
            this.showEdit = false;
          },
            show_add() {
              this.showAdd = true;
            },
            close(value) {
              this.showAdd = !value;
            },
            submitAdd(name) {
              this.$refs[name].validate((valid) => {
                if (valid) {
                  let _this = this;
                  this.formItem.check_in_date = this.$root.getLocalDate(this.formItem.check_in_date) + ' 00:00:00';
                  this.formItem.check_out_date = this.$root.getLocalDate(this.formItem.check_out_date) + ' 00:00:00';
                  this.formItem.order_date = this.$root.getLocalDate(this.formItem.order_date_day).split(' ')[0] + ' ' + new Date(this.formItem.order_date_time).toTimeString().split(' ')[0];
                  this.$root.ajaxPost({
                    funName:'saveOrderOTHER',
                    params: {
                      data: this.formItem
                    }
                  }, function(res) {
                    _this.listFilter();
                    _this.$Message.info('成功添加！');
                    _this.showAdd = false;
                    _this.formItem = Object.assign({}, _this.defaultItem);
                  })
                } else {
                  this.$Message.error('请输入相关数据!');
                }
              })
            },
            cancelAdd() {
              this.showAdd = false;
            },
            gotoDetail(item) {
              let _this = this;
              this.$root.ajaxPost({
                funName:'getOrderDetailOTHER',
                params: {
                  _id: item._id
                }
              }, function(res) {
                let detail = res;
                _this.detail = detail;
                _this.showDetail = true;
              })
            },
            closeDetail() {
              this.showDetail = false;
            }
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 280;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
