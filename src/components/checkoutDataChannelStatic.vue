<template lang="html">
    <div class="">
        <div class="top">
            <Row>
                <Col span="12">
                <h3>离店数据渠道占比分析</h3>
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
          <div class="ivu-table-wrapper">
            <table class="ivu-table" cellspacing="0" cellpadding="0" border="0">
              <thead>
                <tr>
                  <th rowspan="2">序号</th>
                  <th rowspan="2">酒店</th>
                  <th colspan="4">美团</th>
                  <th colspan="4">携程</th>
                  <th colspan="4">途牛</th>
                  <th colspan="4">合计</th>
                </tr>
                <tr>
                  <th>订单数</th>
                  <th>间夜数</th>
                  <th>订单数％</th>
                  <th>间夜数％</th>
                  <th>订单数</th>
                  <th>间夜数</th>
                  <th>订单数％</th>
                  <th>间夜数％</th>
                  <th>订单数</th>
                  <th>间夜数</th>
                  <th>订单数％</th>
                  <th>间夜数％</th>
                  <th>订单数</th>
                  <th>间夜数</th>
                  <th>订单数％</th>
                  <th>间夜数％</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hotel in data">
                  <td>{{hotel.index}}</td>
                  <td>{{hotel.hotel}}</td>
                  <td>{{hotel.mt.order_number}}</td>
                  <td>{{hotel.mt.room_nights}}</td>
                  <td>{{hotel.mt.order_number_percent}}</td>
                  <td>{{hotel.mt.room_nights_percent}}</td>
                  <td>{{hotel.xc.order_number}}</td>
                  <td>{{hotel.xc.room_nights}}</td>
                  <td>{{hotel.xc.order_number_percent}}</td>
                  <td>{{hotel.xc.room_nights_percent}}</td>
                  <td>{{hotel.tn.order_number}}</td>
                  <td>{{hotel.tn.room_nights}}</td>
                  <td>{{hotel.tn.order_number_percent}}</td>
                  <td>{{hotel.tn.room_nights_percent}}</td>
                  <td>{{hotel.total.order_number}}</td>
                  <td>{{hotel.total.room_nights}}</td>
                  <td>{{hotel.total.order_number_percent}}</td>
                  <td>{{hotel.total.room_nights_percent}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            let month = new Date().getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            return {
                filterTime: new Date().getFullYear() + '-' + month,
                data: []
            }
        },
        created() {
            this.postData();
        },
        methods: {
            postData() {
                let _this = this;
                this.$root.ajaxPost({
                    funName: 'getCheckoutDataChannelStatic',
                    params: {
                        time: _this.filterTime
                    }
                }, function (res) {
                    _this.initData(res);
                })
            },
            initData(data) {
                data.forEach(function (_data, _index) {
                    _data.index = _index + 1;
                    _data.hotel = _data.name;
                })
                this.data = data;
            },
            filterTimeChange(value) {
                this.filterTime = value;
                this.postData();
            },
        }
    }
</script>

<style lang="css" scoped>
    .top {
        height: 40px;
        line-height: 40px;
        position: relative;
    }
    th, th {
      padding: 10px 20px;
    }
    th, td {
      border-right: 1px solid #e9eaec;
    }
    table {
      min-width: 100%;
    }
    .ivu-table-wrapper {
      overflow: auto;
    }
    .ivu-table:before, .ivu-table::after {
      background: transparent;
    }
</style>
