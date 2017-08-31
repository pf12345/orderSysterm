<template lang="html">
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>离店毛利统计</h3>
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

      <Table :height="470" :columns="columns" :data="data"></Table>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    let month = new Date().getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let defaultColumns = [{
      title: '序号',
      width: 80,
      key: 'index'
    },{
      title: '酒店',
      width: 150,
      key: 'hotel'
    }];
    return {
      filterTime: new Date().getFullYear() + '-' + month,
      defaultColumns: Object.assign([], defaultColumns),
      columns: Object.assign([], defaultColumns),
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
        funName: 'checkoutGrossProfitStatic',
        params: {
          time: _this.filterTime
        }
      }, function(res) {
        _this.initData(res);
      })
    },
    filterTimeChange(value) {
      this.filterTime = value;
      this.postData();
    },
    initData(data) {
      this.data= [];
      var one_datas = data[0].data;
      var _columns = Object.assign([], this.defaultColumns);
      var _datas = [];
      var _totalRow = {
        index: '合计',
        hotel: '',
        total: 0
      }
      for(let key in one_datas) {
        _columns.push({
          title: key + '('+one_datas[key].weekday+')',
          width: 180,
          key: key
        });
        _totalRow[key] = 0;
      }
      _columns.push({
        title: '总计',
        width: 120,
        key: 'total'
      })

      data.forEach(function(_data, _index) {
        var _item = {
          'total': 0
        };
        for(let key in  _data.data) {
          _item[key] = _data.data[key].value || 0;
          _item.total += _data.data[key].value || 0;
          _totalRow[key] += _data.data[key].value || 0;
        }
        _item.index = _index;
        _item.hotel = _data.name;
        _datas.push(_item);
      })
      for(let key in _totalRow) {
        if(['index', 'total', 'hotel'].indexOf(key) == -1) {
          _totalRow.total += _totalRow[key];
        }
      }
      _datas.push(_totalRow);
      this.data = _datas;
      this.columns = _columns;
    }
  }
}
</script>

<style lang="css">

</style>
