<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据-携程</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Upload :action="actionUrl" :show-upload-list="false" :on-success="handleSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div class="item">
        <Radio-group v-model="listFilterKey">
          <Radio label="no">
            <span>无</span>
          </Radio>
          <Radio label="check_out_date">
              <span>离店日期</span>
          </Radio>
          <Radio label="check_in_date">
              <span>入住日期</span>
          </Radio>
          <Radio label="order_date">
            <span>下单日期</span>
          </Radio>
        </Radio-group>
        <Date-picker v-if="listFilterKey != 'no'" v-model="listFilterStartTime" type="date" placeholder="开始时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <span v-if="listFilterKey != 'no'">至</span>
        <Date-picker v-if="listFilterKey != 'no'" v-model="listFilterEndTime" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
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
    <Modal
        v-model="showModal"
        title="导入数据预览(请确认数据是否正确)"
        @on-ok="ok"
        width="700"
        @on-cancel="cancel">
        <Table :columns="columns" :data="previewData"></Table>
    </Modal>

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑订单</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
        <Form-item label="订单号" prop="order_number">
            <Input v-model="editFormItem.order_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店名称" prop="hotel">
            <Input v-model="editFormItem.hotel" placeholder="请输入"></Input>
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

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">携程订单详情 <span>
        <a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a>
        <a @click="addSettlementAmountClick">修改结算金额</a>
      </span></span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>平台</h4>
          <p>{{detail.platform}}</p>
        </div>
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
    <Modal
        v-model="showModal1"
        title="修改结算金额"
        @on-ok="addSettlementAmount('formItem')"
        width="700">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="结算金额" prop="settlementAmount">
              <Input v-model="formItem.settlementAmount" placeholder="请输入结算金额"></Input>
          </Form-item>
        </Form>
    </Modal>
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
  .addContent {
    padding: 20px 20px 20px 10px;
    position: absolute;
    top: 50px;
    width: 100%;
    left: 0;
    bottom: 0;
    overflow: auto;
  }
  .item {
    margin: 0 0 20px 10px;
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
                showModal1: false,
                showDetail: false,
                showEdit: false,
                listFilterKey: 'no',
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
                tableHeight: '',
                actionUrl: this.$root.serverUrl + '/exportOrderOriginal',
                formItem: {
                  settlementAmount: 0
                },
                editFormItem: {},
                ruleEditValidate: {
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
                  ]
                },
                ruleValidate: {
                  settlementAmount: [
                    { required: true, message: '结算金额不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                  {
                      title: '订单号',
                      key: 'order_number',
                      width: 120,
                      // fixed: 'left'
                  },
                  {
                      title: '发单单号',
                      width: 120,
                      key: 'billing_number',
                      // fixed: 'left'
                  },
                  {
                      title: '酒店',
                      key: 'hotel',
                      width: 150
                  },
                    {
                        title: '房型',
                        width: 180,
                        key: 'room_type'
                    },
                    {
                        title: '入住日期',
                        width: 100,
                        key: 'check_in_date',
                        render(h, {row, column, index}) {
                          return `${row.check_in_date.split(' ')[0]}`
                        }
                    },
                    {
                        title: '离店日期',
                        width: 120,
                        key: 'check_out_date',
                        render(h, {row, column, index}) {
                          return `${row.check_out_date.split(' ')[0]}`
                        }
                    },
                    {
                        title: '房间数',
                        width: 80,
                        key: 'room_number'
                    },
                    {
                        title: '晚数',
                        width: 80,
                        key: 'stay_days'
                    },
                    {
                        title: '间夜数',
                        width: 80,
                        key: 'room_nights'
                    },
                    {
                        title: '入住人',
                        width: 120,
                        key: 'custom_name'
                    },
                    {
                        title: '下单日期',
                        width: 150,
                        key: 'order_date'
                    },

                    {
                        title: '总金额',
                        width: 120,
                        key: 'money'
                    },
                    {
                        title: '结算金额',
                        width: 200,
                        key: 'settlement'
                    },
                    {
                        title: '酒店确认号',
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
        },
        methods: {
          listFilter() {
            let _this = this;
            this.$root.ajaxGet({
              funName: 'getOrderListXC',
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
                  funName: 'updateOrderXCItem',
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
                  funName: 'deleteOrderXCitem',
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
            ok () {
                let _this = this;
                this.$root.ajaxPost({
                  funName:'saveOrderXC',
                  params: {
                    data: this.exportData
                  }
                }, function(res) {
                  _this.listFilter();
                  _this.$Message.info('导入成功');
                })
            },
            cancel () {
                // console.log('点击了取消');
                // this.$Message.info('点击了取消');
            },
            handleSuccess(response) {
              let _previewData = [];
              if(response.result == 'TRUE') {
                  this.exportData = response.data;
                  _previewData = response.data;
                  this.previewData = _previewData;
                  this.$Message.info('数据读取成功');
              }
              this.showModal = true;
            },
            gotoDetail(item) {
              let _this = this;
              this.$root.ajaxPost({
                funName:'getOrderDetailXC',
                params: {
                  _id: item._id
                }
              }, function(res) {
                let detail = res;
                _this.detail = detail;
                _this.showDetail = true;
                _this.formItem.settlementAmount = detail.settlement;
              })
            },
            closeDetail() {
              this.showDetail = false;
            },
            addSettlementAmountClick() {
              this.showModal1 = true;
            },
            addSettlementAmount(name) {
              var go = false;
              let _this = this;
              this.$refs[name].validate((valid) => {
                if (valid) {
                  let _this = this;
                  go = true;
                  this.$root.ajaxPost({
                    funName: 'updateOrderXCItem',
                    params: {
                      _id: this.detail._id,
                      settlement: this.formItem.settlementAmount
                    }
                  }, function(res) {
                    _this.$Message.info('成功修改结算金额');
                    _this.gotoDetail(_this.detail);
                  })
                } else {
                  go = false;
                  this.$Message.error('请输入相关数据!');
                }
              })
              if(!go) {
                return false;
              }
            },
            closeEdit() {
              this.showEdit = false;
            }
        },
        watch: {
          'data'() {
            if(!this.tableHeight) {
              this.tableHeight = window.innerHeight - 280;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
