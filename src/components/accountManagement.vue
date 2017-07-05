<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>账号管理</h3>
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

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑编辑</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
        <Form-item label="用户名" prop="name">
            <Input v-model="editFormItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="密码" prop="pwd">
            <Input type="password" v-model="editFormItem.pwd" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="权限限制">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <Checkbox-group v-model="editFormItem.jurisdictions" @on-change="checkAllGroupChange">
              <Checkbox label="数据录入"></Checkbox>
              <Checkbox label="数据监控及记录保存"></Checkbox>
              <Checkbox label="酒店账单比对"></Checkbox>
              <br>
              <Checkbox label="每日新订订单量"></Checkbox>
              <Checkbox label="每日新订订单间夜"></Checkbox>
              <Checkbox label="入住数据分析"></Checkbox>
              <Checkbox label="离店数据汇总"></Checkbox>
              <Checkbox label="离店数据渠道占比分析"></Checkbox>
              <Checkbox label="离店数据明细"></Checkbox>
              <Checkbox label="亏损订单明细"></Checkbox>
          </Checkbox-group>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitEdit('editFormItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
        </Form-item>
    </Form>
      </div>
    </left-page>

    <left-page :show="showAdd" @on-close="close">
      <span slot="title">新建账号</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
        <Form-item label="用户名" prop="name">
            <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
            <Input type="password" v-model="formItem.password" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="权限限制">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <Checkbox-group v-model="formItem.jurisdictions" @on-change="checkAllGroupChange">
              <Checkbox label="数据录入"></Checkbox>
              <Checkbox label="数据监控及记录保存"></Checkbox>
              <Checkbox label="酒店账单比对"></Checkbox>
              <br>
              <Checkbox label="每日新订订单量"></Checkbox>
              <Checkbox label="每日新订订单间夜"></Checkbox>
              <Checkbox label="入住数据分析"></Checkbox>
              <Checkbox label="离店数据汇总"></Checkbox>
              <Checkbox label="离店数据渠道占比分析"></Checkbox>
              <Checkbox label="离店数据明细"></Checkbox>
              <Checkbox label="亏损订单明细"></Checkbox>
          </Checkbox-group>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>
    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">账号详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>用户名</h4>
          <p>{{detail.name}}</p>
        </div>
        <div class="item">
          <h4>密码</h4>
          <p>{{detail.pwd}}</p>
        </div>
        <div class="item">
          <h4>权限</h4>
          <p>{{detail.jurisdictions ? detail.jurisdictions.join(',') : 'all'}}</p>
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
              indeterminate: true,
              checkAll: false,
              defaultJurisdictions: Object.assign([], defaultJurisdictions),
                showDetail: false,
                showEdit: false,
                tableHeight: '',
                showAdd: false,
                detail: {},
                editFormItem: {},
                ruleEditValidate: {
                  name: [
                    { required: true, message: '用户名不能为空', trigger: 'change' }
                  ],
                  pwd: [
                    { required: true, message: '密码不能为空', trigger: 'change' }
                  ]
                },
                formItem: {
                    name: '',
                    password: '',
                    jurisdictions: Object.assign([], defaultJurisdictions)
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
                        title: '用户名',
                        width: 120,
                        key: 'name',
                        // fixed: 'left'
                    },
                    {
                        title: '密码',
                        width: 150,
                        key: 'pwd',

                    },
                    {
                        title: '权限',
                        key: 'jurisdictions'
                    }
                ],
                data: [],
                previewData: [],
                exportData: []
            }
        },
        created() {
          this.listFilter();
        },
        methods: {
          handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.formItem.jurisdictions = Object.assign([], this.defaultJurisdictions);
                    this.editFormItem.jurisdictions = Object.assign([], this.defaultJurisdictions);
                } else {
                    this.formItem.jurisdictions = [];
                    this.editFormItem.jurisdictions = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
          listFilter() {
            let _this = this;
            this.$root.ajaxGet({
              funName: 'getUserList'
            }, function(res, initRes) {
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          editItem() {
            this.editFormItem = {
              name: this.detail.name,
              pwd: this.detail.pwd,
              jurisdictions: this.detail.jurisdictions,
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
                  funName: 'updateUserItem',
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
                  funName: 'deleteUserItem',
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
              this.$refs[name].validate((valid) => {
                if (valid) {
                  this.$root.ajaxPost({
                    funName:'addUser',
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
