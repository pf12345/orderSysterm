<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>平台账单</h3>
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
        <div style="margin-bottom: 20px;">
            <Date-picker type="month" @on-change="filterTimeChange" v-model="filterTime" placeholder="选择月"
                         style="width: 200px"></Date-picker>
        </div>

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
        <p>共{{previewData.length}}条数据</p>
        <Table :columns="columns" :data="previewData"></Table>
    </Modal>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">订单详情 <span>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a>
      </span></span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>姓名</h4>
          <p>{{detail.name}}</p>
        </div>
        <div class="item">
          <h4>发单单号</h4>
          <p>{{detail.billing_number}}</p>
        </div>
        <div class="item">
          <h4>酒店确认号</h4>
          <p>{{detail.hotel_confirm_number}}</p>
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
          <p>{{detail.nights}}</p>
        </div>
        <div class="item">
          <h4>间夜数</h4>
          <p>{{detail.room_nights}}</p>
        </div>

        <div class="item">
          <h4>结算单价</h4>
          <p>{{detail.unit_settlement}}</p>
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
          let month = new Date().getMonth() + 1;
          month = month < 10 ? '0' + month : month;
            return {
                showModal: false,
                showModal1: false,
                showDetail: false,
                showEdit: false,
                limit: 20,
                page: 1,
                total: 0,
                filterTime: new Date().getFullYear() + '-' + month,
                detail: {},
                tableHeight: '',
                actionUrl: this.$root.serverUrl + '/exportPlatformOrders',
                formItem: {
                  settlementAmount: 0
                },

                columns: [
                  {
                      title: '订单号',
                      key: 'order_number',
                      width: 120,
                      // fixed: 'left'
                  },
                  {
                      title: '城市',
                      key: 'city',
                      width: 150
                  },
                    {
                        title: '酒店',
                        width: 180,
                        key: 'hotel'
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
                        key: 'nights'
                    },
                    {
                        title: '间夜数',
                        width: 80,
                        key: 'room_nights'
                    },
                    {
                        title: '结算金额',
                        width: 200,
                        key: 'settlement'
                    },
                    {
                        title: '入住人',
                        width: 200,
                        key: 'name'
                    },
                    {
                        title: '预定日期',
                        width: 200,
                        key: 'order_date'
                    },
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
            this.$root.ajaxPost({
              funName: 'getPlatformOrdersList',
              params: {
                limit: this.limit,
                page: this.page,
                time: _this.filterTime
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
          deleteItem() {
            let _this = this;
            this.$Modal.confirm({
              title: '确认信息',
              content: '确认删除此数据？',
              onOk() {
                _this.$root.ajaxPost({
                  funName: 'deletePlatformOrdersitem',
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
                  funName:'savePlatformOrders',
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
                funName:'getPlatformOrdersDetail',
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
            filterTimeChange(value) {
                this.filterTime = value;
                this.listFilter();
            },
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 260;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
