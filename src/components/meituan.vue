<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据-美团</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Button type="ghost" icon="ios-cloud-upload-outline">同步数据</Button>
          </div>
        </Col>
    </Row>
    </div>
    <Table :height="tableHeight" :columns="columns" :data="data"></Table>
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
  .top {
    height: 50px;
    line-height: 50px;
    position: relative;
  }
</style>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                tableHeight: '',
                columns: [
                  {
                      title: '平台',
                      key: 'platform',
                      width: 120
                  },
                  {
                      title: '订单号',
                      key: 'order_number',
                      width: 120,
                      fixed: 'left'
                  },
                  {
                      title: '酒店',
                      width: 120,
                      key: 'hotel'
                  },
                    {
                        title: '房型',
                        width: 180,
                        key: 'room_type'
                    },
                    {
                        title: '入住日期',
                        width: 150,
                        key: 'check_in_date'
                    },
                    {
                        title: '离店日期',
                        width: 150,
                        key: 'check_out_date'
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
                        title: '酒店确认号',
                        width: 120,
                        key: 'hotel_confirm_number'
                    }
                ],
                data: [],
                previewData: [],
                exportData: []
            }
        },
        created() {
          let _this = this;
          axios.get('http://127.0.0.1:8033/getOrderListMEITUAN')
          .then(function (response) {
            let _data = response.data.data;
            _this.data =  _data;
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight;
            }
          }
        }
    }
</script>
