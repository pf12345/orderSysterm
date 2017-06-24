<template>
  <div class="warp">
    <div class="item">
      <h3>提前预定天数统计</h3>
      <div id="advanceDays" style="width: 800px;height:500px;margin-top: 20px;"></div>
    </div>

    <div class="item">
      <h3>连住天数统计</h3>
      <div id="stayDays" style="width: 800px;height:500px;margin-top: 20px;"></div>
    </div>

    <div class="item">
      <h3>24h订单分布</h3>
      <div id="hourStatic" style="width: 800px;height:500px;margin-top: 20px;"></div>
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
export default {

  mounted() {
    let _this = this;
    axios.get('http://127.0.0.1:8033/getAdvanceDaysStatic')
    .then(function (response) {
      _this.advanceDays(response.data);
      _this.stayDays(response.data);
      _this.hourStatic(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  methods: {
    advanceDays(response) {
      var advanceDays = response.data.advanceDays;
      var xAxisData = [];
      var percentDays = [];
      var _advanceDays = [];
      var sum = eval(advanceDays.join("+"));
      advanceDays.forEach(function(day, index) {
        if(index < 28) {
          if(index == 0) {
            xAxisData.push('当天');
          }else{
            xAxisData.push(index + '天');
          }
          _advanceDays.push(day);
          percentDays.push(day/sum * 100);
        }
      })
      var  option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          legend: {
              data:['订单量','订单量占比']
          },
          xAxis: [
              {
                  type: 'category',
                  data: xAxisData,
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '订单量',
                  min: 0,
                  max: Math.ceil(Math.max.apply(null, advanceDays) / 5) * 5,
                  interval: Math.ceil(Math.max.apply(null, advanceDays) / 5) * 5 / 10,
                  axisLabel: {
                      formatter: '{value} 间'
                  }
              },
              {
                  type: 'value',
                  name: '订单量占比',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                      formatter: '{value} ％'
                  }
              }
          ],
          series: [
              {
                  name:'订单量',
                  type:'bar',
                  data: _advanceDays
              },
              {
                  name:'订单量占比',
                  type:'line',
                  yAxisIndex: 1,
                  data: percentDays
              }
          ]
      };
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('advanceDays'));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    stayDays(response) {
      var stayDays = response.data.stayDays;
      var xAxisData = [];
      var percentDays = [];
      var _stayDays = [];
      var sum = eval(stayDays.join("+"));
      stayDays.forEach(function(day, index) {
        if(index > 0) {
          xAxisData.push((index) + '天');
          _stayDays.push(day);
          percentDays.push(day/sum * 100);
        }
      })
      var  option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          legend: {
              data:['订单量','订单量占比']
          },
          xAxis: [
              {
                  type: 'category',
                  data: xAxisData,
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '订单量',
                  min: 0,
                  max: Math.ceil(Math.ceil(Math.max.apply(null, stayDays) / 5) * 5 / 10) * 10,
                  interval: Math.ceil(Math.ceil(Math.max.apply(null, stayDays) / 5) * 5 / 10),
                  axisLabel: {
                      formatter: '{value} 间'
                  }
              },
              {
                  type: 'value',
                  name: '订单量占比',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                      formatter: '{value} ％'
                  }
              }
          ],
          series: [
              {
                  name:'订单量',
                  type:'bar',
                  data: _stayDays
              },
              {
                  name:'订单量占比',
                  type:'line',
                  yAxisIndex: 1,
                  data: percentDays
              }
          ]
      };
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('stayDays'));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    hourStatic(response) {
      var hourStatic = response.data.hourStatic;
      var xAxisData = [];
      var percentDays = [];
      var _hourStatic = [];
      var sum = eval(hourStatic.join("+"));
      hourStatic.forEach(function(hour, index) {
        xAxisData.push((index) + ':00');
        _hourStatic.push(hour);
        percentDays.push(hour/sum * 100);
      })
      var  option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          legend: {
              data:['订单量','订单量占比']
          },
          xAxis: [
              {
                  type: 'category',
                  data: xAxisData,
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '订单量',
                  min: 0,
                  max: Math.ceil(Math.ceil(Math.max.apply(null, hourStatic) / 5) * 5 / 10) * 10,
                  interval: Math.ceil(Math.ceil(Math.max.apply(null, hourStatic) / 5) * 5 / 10),
                  axisLabel: {
                      formatter: '{value} 间'
                  }
              },
              {
                  type: 'value',
                  name: '订单量占比',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                      formatter: '{value} ％'
                  }
              }
          ],
          series: [
              {
                  name:'订单量',
                  type:'bar',
                  data: _hourStatic
              },
              {
                  name:'订单量占比',
                  type:'line',
                  yAxisIndex: 1,
                  data: percentDays
              }
          ]
      };
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('hourStatic'));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
}
</script>

<style lang="css" scoped>
  .item {
    margin: 20px 0;
  }
  .warp {
    height: 100%;
    overflow: auto;
  }
</style>
