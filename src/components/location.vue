<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>签到管理</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Button type="ghost" icon="ios-cloud-upload-outline" @click="show_add">签到</Button>
          </div>
        </Col>
    </Row>
    </div>
    <div class="warp_content">
      <div class="item">
        <Date-picker v-model="listFilterStartTime" type="date" placeholder="开始时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <span>至</span>
        <Date-picker v-model="listFilterEndTime" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <Button type="info" @click="listFilter">查询</Button>
      </div>
      <Table :height="tableHeight" :columns="columns" :data="data" @on-row-click="gotoDetail"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="total" :current="page" :page-size="limit" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
          <Form-item label="签到日期">
              <Date-picker type="date" placeholder="选择日期" v-model="editFormItem.check_date"></Date-picker>
          </Form-item>
          <Form-item label="签到类型" prop="check_type">
              <Select v-model="editFormItem.check_type" placeholder="请选择签到类型">
                <Option value="early">早班</Option>
                <Option value="night">晚班</Option>
              </Select>
          </Form-item>
          <Form-item label="签到人" prop="userName">
              <Input v-model="editFormItem.userName" placeholder="请输入"></Input>
          </Form-item>

          <Form-item>
              <Button type="primary" @click="submitEdit('editFormItem')">提交</Button>
              <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
          </Form-item>
        </Form>
      </div>
    </left-page>

    <left-page :show="showAdd" @on-close="close">
      <span slot="title">添加签到信息</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="签到日期">
              <Date-picker type="date" placeholder="选择日期" v-model="formItem.check_date"></Date-picker>
          </Form-item>
          <Form-item label="签到类型" prop="check_type">
              <Select v-model="formItem.check_type" placeholder="请选择签到类型">
                <Option value="early">早班</Option>
                <Option value="night">晚班</Option>
              </Select>
          </Form-item>
          <Form-item label="签到人" prop="userName">
              <Input v-model="formItem.userName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item>
              <Button type="primary" @click="submitAdd('formItem')">提交</Button>
              <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
          </Form-item>
        </Form>
      </div>
    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">签到信息详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>签到日期</h4>
          <p>{{detail.check_date}}</p>
        </div>
        <div class="item">
          <h4>签到类型</h4>
          <p>{{detail.check_type == 'early' ? '早班' : '晚班'}}</p>
        </div>
        <div class="item">
          <h4>签到人</h4>
          <p>{{detail.userName}}</p>
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
  .item {
   margin: 0 0 20px 10px;
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
  .detailTitle {
    position: relative;
    display: inline-block;
    width: 550px;
  }
  .detailTitle span {
    position: absolute;
    right: 10px;
  }
</style>
<script>
    import axios from 'axios'
    import leftPage from './leftPage';
    export default {
        data () {
            var defaultJurisdictions = ['数据录入', '数据监控及记录保存', '酒店账单比对', '每日新订订单量', '每日新订订单间夜', '入住数据分析', '离店数据汇总', '离店数据渠道占比分析', '离店数据明细', '亏损订单明细'];
            return {
                showDetail: false,
                showEdit: false,
                tableHeight: '',
                showAdd: false,
                detail: {},
                editFormItem: {},
                listFilterStartTime: new Date().toLocaleDateString().replace(/\//ig, '-'),
                listFilterEndTime: new Date().toLocaleDateString().replace(/\//ig, '-'),
                limit: 20,
                page: 1,
                total: 0,
                ruleEditValidate: {
                  userName: [
                    { required: true, message: '签到人不能为空', trigger: 'change' }
                  ],
                  check_type: [
                    { required: true, message: '签到类型不能为空', trigger: 'change' }
                  ]
                },
                formItem: {
                    userName: this.$root.user ? this.$root.user.rightName : '',
                    check_type: 'early',
                    check_date: this.$root.getLocalDate()
                },
                ruleValidate: {
                  name: [
                    { required: true, message: '用户名不能为空', trigger: 'change' }
                  ],
                  password: [
                    { required: true, message: '密码不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '签到日期',
                        width: 200,
                        key: 'check_date',
                        // fixed: 'left'
                    },
                    {
                        title: '签到类型',
                        width: 150,
                        key: 'check_type',
                        render(h, {row, column, index}) {
                          return `${row.check_type == 'early' ? '早班' : '晚班'}`
                        }
                    },
                    {
                        title: '签到人',
                        key: 'userName'
                    }
                ],
                data: []
            }
        },
        created() {
          this.listFilter();
        },
        methods: {
          listFilter() {
            let _this = this;
            this.$root.ajaxGet({
              funName: 'getOrderListLocation',
              params: {
                limit: this.limit,
                page: this.page,
                listFilterStartTime: this.$root.getLocalDate(this.listFilterStartTime),
                listFilterEndTime: this.$root.getLocalDate(this.listFilterEndTime)
              }
            }, function(res, initRes) {
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          editItem() {
            this.editFormItem = {
              check_date: this.detail.check_date,
              check_type: this.detail.check_type,
              userName: this.detail.userName,
              _id: this.detail._id
            };
            this.showEdit = true;
            this.showDetail = false;
          },
          cancelEdit() {
            this.showEdit = false;
          },
          submitEdit(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                let _this = this;
                this.$root.ajaxPost({
                  funName: 'updateLocationItem',
                  params: _this.editFormItem
                }, function(res) {
                  _this.$Message.info('修改成功');
                  _this.showEdit = false;
                  _this.listFilter();
                })
              } else {
                this.$Message.error('请输入相关数据!');
              }
            })
          },
          deleteItem() {
            let _this = this;
            this.$Modal.confirm({
              title: '确认信息',
              content: '确认删除此数据？',
              onOk() {
                _this.$root.ajaxPost({
                  funName: 'deleteLocationItem',
                  params: {
                    _id: _this.detail._id
                  }
                }, function(res) {
                  _this.showDetail = false;
                  _this.listFilter();
                })
              }
            });
          },
          closeEdit() {
            this.showEdit = false;
          },
            show_add() {
              this.showAdd = true;
            },
            close(value) {
              this.showAdd = !value;
            },
            submitAdd(name) {
              var _this = this;
              this.formItem.check_date = this.$root.getLocalDate(this.formItem.check_date).split(' ')[0];
              this.$refs[name].validate((valid) => {
                if (valid) {
                  this.$root.ajaxPost({
                    funName:'addLocation',
                    params: {
                      data: this.formItem
                    }
                  }, function(res) {
                    _this.listFilter();
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
              this.detail = item;
              this.showDetail = true;
           },
           closeDetail() {
             this.showDetail = false;
           },
           changePage(value) {
             this.page = value;
             this.listFilter();
           },
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
