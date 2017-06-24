<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>重大销售策略调整记录表</h3>
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
      <span slot="title">新建重大销售策略调整记录单</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="录入时间">
              <Row>
                  <Col span="11">
                    <Form-item prop="order_date_day">
                        <Date-picker type="date" placeholder="选择日期" v-model="formItem.entry_date"></Date-picker>
                    </Form-item>

                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                    <Form-item prop="order_date_time">
                          <Time-picker type="time" placeholder="选择时间" v-model="formItem.entry_time"></Time-picker>
                      </Form-item>

                  </Col>
              </Row>
          </Form-item>
        <Form-item label="酒店名称" prop="hotel">
            <Input v-model="formItem.hotel" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="策略" prop="strategy">
            <Input v-model="formItem.strategy" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
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
                    entry_date: '', //录入时间
                    entry_time: '',//录入时间
                    hotel: '', //酒店名称
                    strategy: '' //策略
                },
                ruleValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  strategy: [
                    { required: true, message: '策略不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '录入时间',
                        width: 120,
                        key: 'created'
                    },
                    {
                        title: '酒店名称',
                        width: 110,
                        key: 'hotel',

                    },
                    {
                        title: '策略',
                        key: 'strategy'
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
