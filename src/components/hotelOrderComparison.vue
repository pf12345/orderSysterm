<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>酒店账单比对</h3>
        </Col>
        <Col span="12">
          <div class="export">

          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div style="margin-bottom: 20px;">
        <Radio-group v-model="listFilterKey">
          <Radio label="check_out_date">
              <span>离店日期</span>
          </Radio>
          <Radio label="check_in_date">
              <span>入住日期</span>
          </Radio>
        </Radio-group>
          <Date-picker type="month" v-model="filterTime" placeholder="选择月" @on-change="dateChange"
                       style="width: 200px"></Date-picker>
                       <div class="" style="display: inline-block; width: 150px;margin-right: 10px;">
                         <Select v-model="hotel" placeholder="请选择酒店名称">
                             <Option v-for="_hotel in filterHotels" :value="_hotel.name" :key="_hotel.key">{{_hotel.name}}</Option>
                         </Select>
                       </div>
        <Button type="info" @click="filterTimeChange">查询</Button>
      </div>
      <Table :row-class-name="rowClassName" :height="tableHeight" :columns="columns" :data="data"></Table>
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
                listFilterKey: 'check_out_date',
                limit: 20,
                page: 1,
                total: 0,
                detail: {},
                tableHeight: '',
                hotel: '全部',
                filterHotels: [{
                  key: "all",
                  name: "全部",
                  name_all: "全部"
                }],
                columns: [
                  {
                    title: '是否正确',
                    key: 'isError',
                    width: 120,
                    render(h, {row, column, index}) {
                      return `${row.isError ? '否' : '是'}`
                    }
                  },

                  {
                      title: '发单单号',
                      key: 'billing_number',
                      width: 150
                  },
                  {
                      title: '酒店结算金额',
                      width: 200,
                      key: 'settlement'
                  },
                  {
                    title: '系统结算金额',
                    width: 200,
                    key: 'systemSettlement'
                  },
                  {
                      title: '姓名',
                      key: 'name',
                      width: 120,
                      // fixed: 'left'
                  },
                    {
                        title: '酒店确认号',
                        width: 180,
                        key: 'hotel_confirm_number'
                    },
                    {
                        title: '入住时间',
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
                        title: '结算单价',
                        width: 200,
                        key: 'unit_settlement'
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
        },
        methods: {
          listFilter() {
            let _this = this;
            this.$root.ajaxPost({
              funName: 'getHotelOrderComparison',
              params: {
                limit: this.limit,
                page: this.page,
                time: _this.filterTime,
                hotel: _this.hotel,
                listFilterKey: _this.listFilterKey
              }
            }, function(res, initRes) {
              // console.log(res, initRes);
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          getHotelList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res) {
              _this.hotels = res;
              _this.filterHotels = _this.filterHotels.concat(res);
            })
          },
          dateChange(value) {
              this.filterTime = value;
          },
          filterTimeChange() {
              // this.filterTime = value;
              this.listFilter();
          },
          changePage(value) {
            this.page = value;
            this.listFilter();
          },
          rowClassName (row, index) {
              if(row.isError) {
                return 'demo-table-error-row';
              }
                return '';
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
