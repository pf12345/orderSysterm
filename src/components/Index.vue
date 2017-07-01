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
          <Radio label="order_date">
              <span>下单时间</span>
          </Radio>
          <Radio label="check_in_date">
              <span>入住时间</span>
          </Radio>
        </Radio-group>
        <Date-picker v-model="listFilterStartTime" type="date" placeholder="开始时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <span>至</span>
        <Date-picker v-model="listFilterEndTime" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
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

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">携程订单详情 <a @click="addSettlementAmountClick">修改结算金额</a></span>
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
  .detailTitle a {
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
                listFilterKey: 'order_date',
                listFilterStartTime: this.$root.getLocalDate(),
                listFilterEndTime: this.$root.getLocalDate(),
                limit: 20,
                page: 1,
                total: 0,
                detail: {},
                tableHeight: '',
                actionUrl: this.$root.serverUrl + '/exportOrderXC',
                formItem: {
                  settlementAmount: 0
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
                listFilterEndTime: this.$root.getLocalDate(this.listFilterEndTime)
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
            ok () {
                let _this = this;
                this.$root.ajaxPost({
                  funName:'saveOrderXC',
                  params: {
                    data: this.exportData
                  }
                }, function(res) {
                  this.listFilter();
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
                      settlementAmount: this.formItem.settlementAmount
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
            }
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 180;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
