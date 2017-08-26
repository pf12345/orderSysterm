<template lang="html">
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>酒店总体统计</h3>
        </Col>
        <Col span="12">
          <div class="export">

          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div class="" style="margin-bottom: 20px;">
        <Date-picker v-model="dateStart" type="date" placeholder="开始时间" style="width: 200px;display:inline-block"></Date-picker>
        <Date-picker v-model="dateEnd" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <Button type="info" @click="find">查询</Button>
      </div>

      <Table :height="550" :columns="columns" :data="data"></Table>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      dateStart: moment().startOf('month').format("YYYY-MM-DD"),
      dateEnd: moment().endOf('month').format("YYYY-MM-DD"),
      columns: [{
        title: '序号',
        width: 80,
        key: 'index',
      },{
        title: '酒店',
        width: 150,
        key: 'name',
      }, {
        title: '总单数',
        key: 'totalOrders'
      }, {
        title: '总间夜',
        key: 'totalRoomNights'
      }, {
        title: '总金额',
        key: 'totalAmount'
      }, {
        title: '总成本',
        key: 'totalSettlement'
      }, {
        title: '总毛利',
        key: 'totalGrossProfit'
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
      this.$root.ajaxGet({
        funName: 'getHotelTotalStatic',
        params: {
          dateStart: _this.dateStart,
          dateEnd: _this.dateEnd
        }
      }, function(res) {
        _this.initData(res);
      })
    },
    initData(data) {
      var arr = [], _this = this, _total = {
        index: '合计',
        totalOrders: 0, //总单数
        totalRoomNights: 0, //总间夜
        totalAmount: 0, //总金额
        totalSettlement: 0, //总成本
        totalGrossProfit: 0 //总毛利
      };
      this.data = [];
      data.forEach(function(_data, _index) {
        var _item = {}
        _item = Object.assign(_data, _data.data);
        _total.totalOrders += Number(_item.totalOrders);
        _total.totalRoomNights += Number(_item.totalRoomNights);
        _total.totalAmount += Number(_item.totalAmount);
        _total.totalSettlement += Number(_item.totalSettlement);
        _total.totalGrossProfit += Number(_item.totalGrossProfit);

        _item.index = _index;
        _this.data.push(_item);
      })
      _this.data.push(_total);
    },
    find() {
      this.postData();
    },
  }
}
</script>

<style lang="css">

</style>
