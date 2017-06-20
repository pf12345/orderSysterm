<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据-携程</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Upload action="http://127.0.0.1:8033/exportOrderXC" :show-upload-list="false" :on-success="handleSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
          </div>
        </Col>
    </Row>
    </div>
    <Table :height="tableHeight" :columns="columns" :data="data"></Table>
    <Modal
        v-model="showModal"
        title="导入数据预览(请确认数据是否正确)"
        @on-ok="ok"
        width="700"
        @on-cancel="cancel">
        <Table :columns="columns" :data="previewData"></Table>
    </Modal>
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
                showModal: false,
                tableHeight: '634',
                columns: [
                    {
                        title: '城市',
                        key: 'city',
                        width: 80
                    },
                    {
                        title: '酒店名称',
                        width: 120,
                        key: 'jd_name'
                    },
                    {
                        title: '订单号',
                        width: 110,
                        key: 'order_umber',
                        fixed: 'left'
                    },
                    {
                        title: 'Source',
                        width: 80,
                        key: 'source'
                    },
                    {
                        title: '订单类型',
                        width: 120,
                        key: 'order_type'
                    },
                    {
                        title: '订单状态',
                        width: 120,
                        key: 'order_status'
                    },
                    {
                        title: '房型名称',
                        width: 120,
                        key: 'chamber_name'
                    },
                    {
                        title: '客人姓名',
                        width: 120,
                        key: 'custom_name'
                    },
                    {
                        title: '入住日期',
                        width: 120,
                        key: 'check_in_date'
                    },
                    {
                        title: '离店日期',
                        width: 120,
                        key: 'leave_date'
                    },
                    {
                        title: '通知时间',
                        width: 150,
                        key: 'notice_date'
                    },
                    {
                        title: '房间数',
                        width: 80,
                        key: 'room_number'
                    },
                    {
                        title: '币种',
                        width: 80,
                        key: 'currency'
                    },
                    {
                        title: '房价',
                        width: 80,
                        key: 'price'
                    },
                    {
                        title: '确认类型',
                        width: 100,
                        key: 'confirm_status'
                    },
                    {
                        title: '酒店确认人',
                        width: 120,
                        key: 'hotel_confirm'
                    },
                    {
                        title: '预订号',
                        width: 80,
                        key: 'reservation_number'
                    },
                    {
                        title: '备注',
                        width: 200,
                        key: 'remarks'
                    },
                    {
                        title: '确认备注',
                        width: 120,
                        key: 'confirm_remarks'
                    }
                ],
                data: [],
                previewData: [],
                exportData: []
            }
        },
        created() {
          let _this = this;
          this.tableHeight = window.innerHeight;
          axios.get('http://127.0.0.1:8033/getOrderListXC')
          .then(function (response) {
            let _data = _this.dealData(response.data.data);
            _this.data =  _data;
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        methods: {
            ok () {
                let _this = this;
                axios.post('http://127.0.0.1:8033/saveOrderXC', {
                  data: this.exportData
                })
                .then(function (response) {
                  let _data = _this.dealData(response.data.data);
                  _this.data =  _this.data.concat(_data);
                  this.$Message.info('导入成功');
                })
                .catch(function (error) {
                  console.log(error);
                });
            },
            cancel () {
                // this.$Message.info('点击了取消');
            },
            dealData(arr) {
              let _arr = []
              arr.forEach(function(object) {
                let _obj = {};
                if(object) {
                  for (var variable in object.data) {
                    if (object.data.hasOwnProperty(variable)) {
                      if(['leave_date', 'notice_date', 'check_in_date'].indexOf(variable) > -1) {
                        let _date = object.data[variable].value;
                        _obj[variable] = new Date(1900, 0, 0, 0, 0, _date * 24 * 60 * 60).toLocaleDateString();
                        if(variable == 'notice_date') {
                          _obj[variable] += ' ';
                          _obj[variable] += new Date(1900, 0, 0, 0, 0, _date * 24 * 60 * 60).toLocaleTimeString()
                        }
                      }else{
                        _obj[variable] = object.data[variable].value
                      }
                    }
                  }
                }
                _arr.push(_obj);
              })
              return _arr;
            },
            handleSuccess(response) {
              let _previewData = [];
              if(response.result == 'TRUE') {
                  this.exportData = response.data;
                  _previewData = this.dealData(response.data);
                  this.previewData = _previewData;
              }
              this.showModal = true;
            }
        }
    }
</script>
