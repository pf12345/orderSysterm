<template lang="html">
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>离店数据汇总</h3>
        </Col>
        <Col span="12">
          <div class="export">

          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div style="margin-bottom: 20px;">
        <Date-picker type="month" @on-change="filterTimeChange" v-model="filterTime" placeholder="选择月" style="width: 200px"></Date-picker>
      </div>
      <Table :height="550" :columns="columns" :data="data"></Table>
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
      columns: [{
        title: '序号',
        width: 80,
        key: 'index',
      },{
        title: '酒店',
        width: 150,
        key: 'hotel',
      }, {
        title: '间夜数',
        width: 120,
        key: 'roomNights'
      }, {
        title: '总金额',
        width: 120,
        key: 'totalAmount'
      }, {
        title: '总金额%',
        width: 120,
        key: 'totalAmountPercent'
      }, {
        title: '结算总额',
        width: 120,
        key: 'totalSettlement'
      }, {
        title: '毛利金额',
        width: 120,
        key: 'grossProfit'
      }, {
        title: '毛利金额%',
        width: 120,
        key: 'grossProfitPercent'
      }, {
        title: '间均毛利',
        width: 120,
        key: 'grossProfitAvg'
      }, {
        title: '毛利率%',
        width: 120,
        key: 'grossProfitRate'
      }, {
        title: '昨日总计间夜数',
        width: 120,
        key: 'roomNightsYesterday'
      }, {
        title: '昨日总计毛利金额',
        width: 180,
        key: 'grossProfitYesterday'
      }, {
        title: '间夜数对比昨日增加',
        width: 180,
        key: 'roomNightsToYesAdd'
      }, {
        title: '毛利金额对比昨日增加',
        width: 180,
        key: 'grossProfitToYesAdd'
      }, {
        title: '间夜数+%',
        width: 120,
        key: 'roomNightsAddPercent'
      }, {
        title: '毛利金额+%',
        width: 120,
        key: 'grossProfitAddPercent'
      }, {
        title: '年累计间夜',
        width: 120,
        key: 'roomNightsTotalYear'
      }],
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
        funName: 'getHotelCheckoutStatic',
        params: {
          time: _this.filterTime
        }
      }, function(res) {
        _this.initData(res);
      })
      this.$root.ajaxGet({
        funName: 'getYesterdayAndTodaydiff'
      }, function(res) {
        _this.initData(res);
      })

      this.$root.ajaxGet({
        funName: 'getYearToTodayRoomNights'
      }, function(res) {
        _this.initData(res);
      })


    },
    initData(data) {

      if(!this.data.length) {
        data.forEach(function(_data, _index) {
          _data.index = _index + 1;
          _data.hotel = _data.name;
        })
        this.data = data;
      }else{
        var _data_arr = [];
        this.data.forEach(function(_data) {
          data.forEach(function(r_data, _index) {
            if(_data.name == r_data.name) {
              _data = Object.assign(_data, r_data);
              _data_arr.push(_data);
            }
          })
        })
        this.data = _data_arr;
      }
    },
    filterTimeChange(value) {
      this.filterTime = value;
      this.postData();
    },
  }
}
</script>

<style lang="css">

</style>
