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
      <div class="item">
        <Date-picker v-model="advanceDaysStart" type="date" placeholder="开始时间" style="width: 200px;display:inline-block"></Date-picker>
        <Date-picker v-model="advanceDaysEnd" type="date" placeholder="截止时间" style="width: 200px;display:inline-block;margin: 0 20px;"></Date-picker>
        <div class="" style="display: inline-block; width: 150px;margin-right: 10px;">
          <Select v-model="hotel" placeholder="请选择酒店名称">
              <Option v-for="_hotel in filterHotels" :value="_hotel.name_all" :key="_hotel.key">{{_hotel.name_all}}</Option>
          </Select>
        </div>

        <Button type="info" @click="filterTimeChange">查询</Button>

      </div>
      <Table :height="tableHeight" :columns="columns" :data="data" @on-row-click="gotoDetail"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="total" :current="page" :page-size="limit" @on-change="changePage"></Page>
        </div>
    </div>
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

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑重大销售策略调整记录单</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
          <Form-item label="酒店名称" prop="hotel">
              <Select v-model="editFormItem.hotel" placeholder="请选择酒店名称">
                  <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

              </Select>
          </Form-item>
          <Form-item label="策略" prop="strategy">
              <Input v-model="editFormItem.strategy" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
          </Form-item>
          <Form-item>
              <Button type="primary" @click="submitEdit('editFormItem')">提交</Button>
              <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
          </Form-item>
        </Form>
      </div>
    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">重大销售策略调整记录单详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
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
                tableHeight: '',
                showAdd: false,
                showDetail: false,
                showEdit: false,
                formItem: {
                    created: '', //录入时间
                    hotel: '', //酒店名称
                    strategy: '' //策略
                },
                detail: {},
                editFormItem: {},
                limit: 20,
                page: 1,
                total: 0,
                advanceDaysStart: this.$root.getLocalDate(),
                advanceDaysEnd: this.$root.getLocalDate(),
                hotel: '全部',
                filterHotels: [{
                  key: "all",
                  name: "全部",
                  name_all: "全部"
                }],
                hotels: [],
                ruleValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  strategy: [
                    { required: true, message: '策略不能为空', trigger: 'change' }
                  ]
                },
                ruleEditValidate: {
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
          this.getHotelList();
          this.listFilter();
        },
        methods: {
          listFilter() {
            let _this = this;
            this.$root.ajaxPost({
              funName: 'getZdxscltzjlList',
              params: {
                limit: this.limit,
                page: this.page,
                start: this.$root.getLocalDate(this.advanceDaysStart),
                end: this.$root.getLocalDate(this.advanceDaysEnd),
                hotel: this.hotel != '全部' ? this.hotel : ''
              }
            }, function(res) {
              _this.data =  res;
            })
          },
          changePage(value) {
            this.page = value;
            this.listFilter();
          },
          getHotelList() {
            var _this = this;
            this.$root.ajaxGet({
              funName: 'getHotelList'
            }, function(res) {
              _this.hotels = res;
              _this.filterHotels = _this.filterHotels.concat(res);
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
            },
            filterTimeChange() {
                this.listFilter();
            },
            editItem() {
              this.editFormItem = Object.assign({},this.detail);
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
                    funName: 'updateZdxscltzjlItem',
                    params: _this.editFormItem
                  }, function(res) {
                    _this.$Message.info('修改成功');
                    _this.showEdit = false;
                    _this.gotoDetail(_this.detail);
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
                    funName: 'deleteZdxscltzjlItem',
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
        },
        watch: {
          'data'() {
            if(this.data.length > 10 && !this.tableHeight) {
              this.tableHeight = window.innerHeight - 180;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
