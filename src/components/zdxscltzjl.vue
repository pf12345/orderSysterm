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
    <div class="warp_content">
      <Table :height="tableHeight" :columns="columns" :data="data" @on-row-click="gotoDetail"></Table>

    </div>

    <left-page :show="showAdd" @on-close="close">
      <span slot="title">新建重大销售策略调整记录单</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="酒店名称" prop="hotel">
              <Select v-model="formItem.hotel" placeholder="请选择酒店名称">
                  <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

              </Select>
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

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title">重大销售策略调整记录单详情</span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>创建时间</h4>
          <p>{{detail.created}}</p>
        </div>
        <div class="item">
          <h4>酒店名称</h4>
          <p>{{detail.hotel}}</p>
        </div>
        <div class="item">
          <h4>策略</h4>
          <p>{{detail.strategy}}</p>
        </div>
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
</style>
<script>
    import axios from 'axios'
    import leftPage from './leftPage';
    export default {
        data () {
            return {
                tableHeight: '',
                showAdd: false,
                showDetail: false,
                formItem: {
                    created: '', //录入时间
                    hotel: '', //酒店名称
                    strategy: '' //策略
                },
                detail: {},
                hotels: [],
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
                        width: 200,
                        key: 'created'
                    },
                    {
                        title: '酒店名称',
                        width: 250,
                        key: 'hotel',

                    },
                    {
                        title: '策略',
                        key: 'strategy'
                    }
                ],
                data: []
            }
        },
        created() {
          let _this = this;
          this.$root.ajaxGet({
            funName: 'getZdxscltzjlList'
          }, function(res) {
            _this.data =  res;
          })
          this.getHotelList();
        },
        methods: {
          getHotelList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res) {
              _this.hotels = res
            })
          },
            show_add() {
              this.showAdd = true;
            },
            close(value) {
              this.showAdd = !value;
            },
            closeDetail(value) {
              this.showDetail = !value;
            },
            submitAdd(name) {
              let _this = this;
              this.$refs[name].validate((valid) => {
                if (valid) {
                  this.$root.ajaxPost({
                    funName:'saveZdxscltzjlItem',
                    params: {
                      data: this.formItem
                    }
                  }, function(res) {
                    _this.data.push(res);
                    _this.$Message.info('新建成功！');
                    _this.showAdd = false;
                  })
                } else {
                  this.$Message.error('请输入相关数据!');
                }
              })
            },
            cancelAdd() {
              this.showAdd = false;
            },
            gotoDetail(item) {
              let _this = this;
              this.$root.ajaxPost({
                funName:'getZdxscltzjlDetail',
                params: {
                  _id: item._id
                }
              }, function(res) {
                let detail = res;
                _this.detail = detail;
                _this.showDetail = true;
              })
            }
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 60;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
