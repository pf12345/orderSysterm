<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据-途牛</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Button type="ghost" icon="ios-cloud-upload-outline" @click="show_add">新建</Button>
          </div>
        </Col>
    </Row>
    </div>
    <Table :height="tableHeight" :columns="columns" :data="data"></Table>

    <left-page :show="showAdd" @on-close="close">
      <span slot="title">新建订单</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
        <Form-item label="订单号" prop="order_number">
            <Input v-model="formItem.order_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店名称" prop="hotel">
            <Input v-model="formItem.hotel" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="房型名称" prop="room_type">
            <Input v-model="formItem.room_type" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="预定日期">
            <Row>
                <Col span="11">
                  <Form-item prop="order_date_day">
                      <Date-picker type="date" placeholder="选择日期" v-model="formItem.order_date_day"></Date-picker>
                  </Form-item>

                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <Form-item prop="order_date_time">
                        <Time-picker type="time" placeholder="选择时间" v-model="formItem.order_date_time"></Time-picker>
                    </Form-item>

                </Col>
            </Row>
        </Form-item>
        <Form-item label="入住日期" prop="check_in_date">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.check_in_date"></Date-picker>
        </Form-item>
        <Form-item label="离店日期" prop="check_out_date">
            <Date-picker type="date" placeholder="选择日期" v-model="formItem.check_out_date"></Date-picker>
        </Form-item>
        <Form-item label="间数" prop="room_number">
            <Input v-model="formItem.room_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="晚数" prop="stay_days">
            <Input v-model="formItem.stay_days" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="入住人姓名" prop="custom_name">
            <Input v-model="formItem.custom_name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="应收金额" prop="money_ys">
            <Input v-model="formItem.money_ys" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="结算金额" prop="money_js">
            <Input v-model="formItem.money_js" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="酒店预定号" prop="hotel_confirm_number">
            <Input v-model="formItem.hotel_confirm_number" placeholder="请输入"></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>
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
  .addContent {
    padding: 20px 20px 20px 10px;
    position: absolute;
    top: 50px;
    width: 100%;
    left: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
<script>
    import axios from 'axios'
    import leftPage from './leftPage';
    export default {
        data () {
            return {
                showModal: false,
                tableHeight: '',
                showAdd: false,
                formItem: {
                    order_number: '',
                    hotel: '',
                    room_type: '',
                    check_in_date: '',
                    check_out_date: '',
                    room_number: '',
                    stay_days: '',
                    custom_name: '',
                    order_date_time: '',
                    order_date_day: '',
                    order_date: '',
                    money_ys: '',
                    money_js: '',
                    hotel_confirm_number: ''
                },
                ruleValidate: {
                  order_number: [
                    { required: true, message: '订单号不能为空', trigger: 'change' }
                  ],
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  room_type: [
                    { required: true, message: '房型不能为空', trigger: 'change' }
                  ],
                  check_in_date: [
                    { required: true, type: 'date', message: '入住时间不能为空', trigger: 'change' }
                  ],
                  check_out_date: [
                    { required: true, type: 'date', message: '离店时间不能为空', trigger: 'change' }
                  ],
                  room_number: [
                    { required: true, message: '间数不能为空', trigger: 'change' }
                  ],
                  stay_days: [
                    { required: true, message: '晚数不能为空', trigger: 'change' }
                  ],
                  custom_name: [
                    { required: true, message: '入住人不能为空', trigger: 'change' }
                  ],
                  order_date_time: [
                    { required: true, type: 'date', message: '下单日期不能为空', trigger: 'change' }
                  ],
                  order_date_day: [
                    { required: true, type: 'date', message: '下单时间不能为空', trigger: 'change' }
                  ],
                  money_ys: [
                    { required: true, message: '应收金额不能为空', trigger: 'change' }
                  ],
                  money_js: [
                    { required: true, message: '结算不能为空', trigger: 'change' }
                  ],
                  hotel_confirm_number: [
                    { required: true, message: '酒店预订号不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '订单号',
                        width: 120,
                        key: 'order_number',
                        fixed: 'left'
                    },
                    {
                        title: '酒店名称',
                        width: 110,
                        key: 'hotel',

                    },
                    {
                        title: '房型名称',
                        width: 120,
                        key: 'room_type'
                    },
                    {
                        title: '预定日期',
                        width: 180,
                        key: 'order_date'
                    },
                    {
                        title: '入住日期',
                        width: 180,
                        key: 'check_in_date'
                    },
                    {
                        title: '离店日期',
                        width: 180,
                        key: 'check_out_date'
                    },
                    {
                        title: '间数',
                        width: 120,
                        key: 'room_number'
                    },
                    {
                        title: '晚数',
                        width: 120,
                        key: 'stay_days'
                    },
                    {
                        title: '入住人姓名',
                        width: 150,
                        key: 'custom_name'
                    },
                    {
                        title: '应收金额',
                        width: 120,
                        key: 'money_ys'
                    },
                    {
                        title: '结算金额',
                        width: 200,
                        key: 'money_js'
                    },
                    {
                        title: '酒店预定号',
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
          axios.get('http://127.0.0.1:8033/getOrderListTUNIU')
          .then(function (response) {
            let _data = response.data.data;
            _this.data =  _data;
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        methods: {
            show_add() {
              this.showAdd = true;
            },
            close(value) {
              this.showAdd = !value;
            },
            submitAdd(name) {
              this.$refs[name].validate((valid) => {
                if (valid) {
                  let _this = this;
                  this.formItem.check_in_date = new Date(this.formItem.check_in_date).toLocaleString();
                  this.formItem.check_out_date = new Date(this.formItem.check_out_date).toLocaleString();
                  this.formItem.order_date = new Date(this.formItem.order_date_day).toLocaleString().split(' ')[0] + ' ' +new Date(this.formItem.order_date_time).toLocaleString().split(' ')[1];
                  axios.post('http://127.0.0.1:8033/saveOrderTUNIU', {
                    data: this.formItem
                  })
                  .then(function (response) {
                    let _data = response.data.data;
                    _this.data.push(_data);
                    _this.$Message.info('新建成功！');
                    _this.showAdd = false;
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                } else {
                  this.$Message.error('请输入相关数据!');
                }
              })
            },
            cancelAdd() {
              this.showAdd = false;
            }
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
