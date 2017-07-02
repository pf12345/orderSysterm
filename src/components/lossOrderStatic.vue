<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>亏损订单明细</h3>
        </Col>
        <Col span="12">
          <div class="export">

          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div style="margin-bottom: 20px;">
          <Date-picker type="month" @on-change="filterTimeChange" v-model="filterTime" placeholder="选择月"
                       style="width: 200px"></Date-picker>
      </div>
      <Table :height="tableHeight" :columns="columns" :data="data"></Table>
    </div>
    </div>
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
                filterTime: new Date().getFullYear() + '-' + month,
                limit: 20,
                page: 1,
                total: 0,
                detail: {},
                tableHeight: '',
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
            this.$root.ajaxPost({
              funName: 'getLossStatic',
              params: {
                  time: _this.filterTime
              }
            }, function(res, initRes) {
              console.log(res, initRes);
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          filterTimeChange(value) {
              this.filterTime = value;
              this.listFilter();
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
