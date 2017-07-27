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
      <div class="item">
        <Date-picker v-model="advanceDaysStart" type="date" placeholder="开始时间" style="width: 200px;display:inline-block"></Date-picker>
        <Date-picker v-model="advanceDaysEnd" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <div class="" style="display: inline-block; width: 150px;margin-right: 10px;">
          <Select v-model="hotel" placeholder="请选择酒店名称">
              <Option v-for="_hotel in hotels" :value="_hotel.name_all" :key="_hotel.key">{{_hotel.name_all}}</Option>
          </Select>
        </div>

        <Button type="info" @click="filterTimeChange">查询</Button>

      </div>
      <!-- <div style="margin-bottom: 20px;">
          <Date-picker type="month" @on-change="filterTimeChange" v-model="filterTime" placeholder="选择月"
                       style="width: 200px"></Date-picker>
      </div> -->
      <Table :height="tableHeight" :columns="columns" :data="data"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="total" :current="page" :page-size="limit" @on-change="changePage"></Page>
        </div>
    </div>
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
                advanceDaysStart: this.$root.getLocalDate(),
                advanceDaysEnd: this.$root.getLocalDate(),
                hotel: '全部',
                hotels: [{
                  key: "all",
                  name: "全部",
                  name_all: "全部"
                }],
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
          this.getHotelList();
          this.listFilter();
        },
        methods: {
          getHotelList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res) {
              _this.hotels = _this.hotels.concat(res)
            })
          },
          listFilter() {
            let _this = this;
            this.$root.ajaxPost({
              funName: 'getLossStatic',
              params: {
                limit: this.limit,
                page: this.page,
                start: this.$root.getLocalDate(this.advanceDaysStart),
                end: this.$root.getLocalDate(this.advanceDaysEnd),
                hotel: this.hotel != '全部' ? this.hotel : ''
              }
            }, function(res, initRes) {
              // console.log(res, initRes);
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          changePage(value) {
            this.page = value;
            this.listFilter();
          },
          filterTimeChange() {
              this.listFilter();
          }
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 210;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
