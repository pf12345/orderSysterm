<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>酒店管理</h3>
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
      <span slot="title">编辑</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
        <Form-item label="酒店名称" prop="name_all">
            <Input v-model="editFormItem.name_all" placeholder="请输入酒店全称(如，成都高新豪生大酒店)"></Input>
        </Form-item>
        <Form-item label="酒店简称" prop="name">
            <Input v-model="editFormItem.name" placeholder="请输入酒店简称(如，高新豪生)"></Input>
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
          <Form-item label="酒店名称" prop="name_all">
              <Input v-model="formItem.name_all" placeholder="请输入酒店全称(如，成都高新豪生大酒店)"></Input>
          </Form-item>
          <Form-item label="酒店简称" prop="name">
              <Input v-model="formItem.name" placeholder="请输入酒店简称(如，高新豪生)"></Input>
          </Form-item>

        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>
    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">酒店详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>酒店名称</h4>
          <p>{{detail.name_all}}</p>
        </div>
        <div class="item">
          <h4>酒店简称</h4>
          <p>{{detail.name}}</p>
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
            return {
              indeterminate: true,
              checkAll: false,
                showDetail: false,
                showEdit: false,
                tableHeight: '',
                showAdd: false,
                detail: {},
                editFormItem: {},
                ruleEditValidate: {
                  name_all: [
                    { required: true, message: '酒店全称不能为空', trigger: 'change' }
                  ],
                  name: [
                    { required: true, message: '酒店简称不能为空', trigger: 'change' }
                  ]
                },
                formItem: {
                    name_all: '',
                    name: ''
                },
                ruleValidate: {
                  name_all: [
                    { required: true, message: '酒店全称不能为空', trigger: 'change' }
                  ],
                  name: [
                    { required: true, message: '酒店简称不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '酒店全称',
                        key: 'name_all',
                        // fixed: 'left'
                    },
                    {
                        title: '酒店简称',
                        width: 200,
                        key: 'name',
                        // fixed: 'left'
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
          listFilter() {
            let _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res, initRes) {
              _this.data =  res;
              _this.total = initRes.count;
            })
          },
          editItem() {
            this.editFormItem = {
              name: this.detail.name,
              name_all: this.detail.name_all,
              key: this.detail.key,
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
                  funName: 'updateHotelItem',
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
                  funName: 'deleteHotelItem',
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
              this.$refs[name].validate((valid) => {
                if (valid) {
                  this.$root.ajaxPost({
                    funName:'addHotel',
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
