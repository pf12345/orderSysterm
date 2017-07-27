<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>测试单记录表</h3>
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
      <span slot="title">新建测试单记录表</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
          <Form-item label="录入时间">
              <Row>
                  <Col span="11">
                    <Form-item prop="entry_date_day">
                        <Date-picker type="date" placeholder="选择日期" v-model="formItem.entry_date_day"></Date-picker>
                    </Form-item>

                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                    <Form-item prop="entry_date_time">
                          <Time-picker type="time" placeholder="选择时间" v-model="formItem.entry_date_time"></Time-picker>
                      </Form-item>

                  </Col>
              </Row>
          </Form-item>
          <Form-item label="酒店名称" prop="hotel">
              <Select v-model="formItem.hotel" placeholder="请选择酒店名称">
                  <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

              </Select>
          </Form-item>
        <Form-item label="测试渠道" prop="test_channel">
            <Input v-model="formItem.test_channel" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="价格" prop="price">
            <Input v-model="formItem.price" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="上传图片">
          <Upload :action="uoloadImageAction" accept="image/jpeg,image/gif,image/x-png" :show-upload-list="false" :on-success="handleSuccess">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <div class="demo-upload-list" v-for="file in formItem.files" v-if="file">
            <img :src="file">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(file)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(file)"></Icon>
            </div>
          </div>
          <Modal title="查看图片" v-model="visible">
            <img :src="previewImgUrl" v-if="visible" style="width: 100%">
          </Modal>
        </Form-item>
        <Form-item label="姓名" prop="xingming">
            <Input v-model="formItem.xingming" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="电话" prop="dianhua">
            <Input v-model="formItem.dianhua" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="测试结果" prop="result">
            <Input v-model="formItem.result" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="是否退款" prop="istuikuan">
            <Select v-model="formItem.istuikuan" placeholder="请选择是/否" @on-change="selectChange('xc')">
                <Option value="是">是</Option>
                <Option value="否">否</Option>
            </Select>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>

    <left-page :show="showEdit" @on-close="closeEdit">
      <span slot="title">编辑测试单记录表</span>
      <div slot="content" class="addContent">
        <Form :model="editFormItem" ref="editFormItem" :label-width="100" :rules="ruleEditValidate">
          <Form-item label="录入时间">
              <Row>
                  <Col span="11">
                    <Form-item prop="entry_date_day">
                        <Date-picker type="date" placeholder="选择日期" v-model="editFormItem.entry_date_day"></Date-picker>
                    </Form-item>

                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                    <Form-item prop="entry_date_time">
                          <Time-picker type="time" placeholder="选择时间" v-model="editFormItem.entry_date_time"></Time-picker>
                      </Form-item>

                  </Col>
              </Row>
          </Form-item>
          <Form-item label="酒店名称" prop="hotel">
              <Select v-model="editFormItem.hotel" placeholder="请选择酒店名称">
                  <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

              </Select>
          </Form-item>
        <Form-item label="测试渠道" prop="test_channel">
            <Input v-model="editFormItem.test_channel" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="价格" prop="price">
            <Input v-model="editFormItem.price" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="姓名" prop="xingming">
            <Input v-model="editFormItem.xingming" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="电话" prop="dianhua">
            <Input v-model="editFormItem.dianhua" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="测试结果" prop="result">
            <Input v-model="editFormItem.result" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="是否退款" prop="istuikuan">
            <Select v-model="editFormItem.istuikuan" placeholder="请选择是/否" @on-change="selectChange('xc')">
                <Option value="是">是</Option>
                <Option value="否">否</Option>
            </Select>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitEdit('editFormItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>

    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">测试单记录表详情
        <span><a @click="editItem">编辑</a>
        <a @click="deleteItem" style="margin: 0 10px;">删除</a></span>
      </span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>录入时间</h4>
          <p>{{detail.entry_date}}</p>
        </div>
        <div class="item">
          <h4>酒店名称</h4>
          <p>{{detail.hotel}}</p>
        </div>
        <div class="item">
          <h4>测试渠道</h4>
          <p>{{detail.test_channel}}</p>
        </div>
        <div class="item">
          <h4>价格</h4>
          <p>{{detail.price}}</p>
        </div>
        <div class="item">
          <h4>姓名</h4>
          <p>{{detail.xingming}}</p>
        </div>
        <div class="item">
          <h4>电话</h4>
          <p>{{detail.dianhua}}</p>
        </div>
        <div class="item">
          <h4>测试结果</h4>
          <p>{{detail.result}}</p>
        </div>
        <div class="item">
          <h4>是否退款</h4>
          <p>{{detail.istuikuan}}</p>
        </div>
        <div class="item">
          <h4>附件</h4>
          <div class="demo-upload-list" v-for="(file, index) in detail.files" v-if="file">
            <img :src="file" @click="handleViewDetail(file)">
          </div>
          <Modal title="查看图片" v-model="visibleDetail">
            <img :src="previewDetailImgUrl" v-if="visibleDetail" style="width: 100%">
          </Modal>
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
  .item {
    margin: 0 0 20px 10px;
  }
  .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
        margin-top: 10px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
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
                visible: false,
                visibleDetail: false,
                detail: {
                  files: ['']
                },
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
                previewImgUrl: '',
                previewDetailImgUrl: '',
                uoloadImageAction: this.$root.serverUrl + '/uploadImageCsdjlb',
                formItem: {
                    entry_date_day: '', //录入时间
                    entry_date_time: '',//录入时间
                    entry_date: '',
                    hotel: '', //酒店名称
                    price: '', //价格
                    files: [''], //附件列表
                    xingming: '',
                    dianhua: '',
                    result: '',
                    istuikuan: '',
                    test_channel: '' //测试渠道
                },
                ruleValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  test_channel: [
                    { required: true, message: '测试渠道不能为空', trigger: 'change' }
                  ],
                  price: [
                    { required: true, message: '价格不能为空', trigger: 'change' }
                  ]
                },
                ruleEditValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  test_channel: [
                    { required: true, message: '测试渠道不能为空', trigger: 'change' }
                  ],
                  price: [
                    { required: true, message: '价格不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '录入时间',
                        width: 200,
                        key: 'entry_date'
                    },
                    {
                        title: '酒店名称',
                        key: 'hotel',
                        width: 150,
                    },
                    {
                        title: '测试渠道',
                        key: 'test_channel',
                        width: 150,
                    },
                    {
                        title: '价格',
                        key: 'price',
                        width: 120
                    },
                    {
                        title: '姓名',
                        key: 'xingming',
                        width: 120
                    },
                    {
                        title: '电话',
                        key: 'dianhua',
                        width: 120
                    },
                    {
                        title: '测试结果',
                        key: 'result',
                        width: 120
                    },
                    {
                        title: '是否退款',
                        key: 'istuikuan',
                        width: 120
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
              funName: 'getCsdjlbList',
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
                  this.formItem.entry_date = new Date(this.formItem.entry_date_day).toLocaleString().split(' ')[0] + ' ' +new Date(this.formItem.entry_date_time).toLocaleString().split(' ')[1]
                  this.$root.ajaxPost({
                    funName:'saveCsdjlbItem',
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
                funName:'getCsdjlbDetail',
                params: {
                  _id: item._id
                }
              }, function(res) {
                let detail = res;
                _this.detail = detail;
                _this.showDetail = true;
              })
            },
            handleSuccess(response) {
              this.formItem.files.push(this.$root.serverUrl + response.data.url)
            },
            handleView (item) {
                this.previewImgUrl = item;
                this.visible = true;
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
                const fileList = this.formItem.files;
                this.formItem.files.splice(fileList.indexOf(file), 1);
            },
            handleViewDetail (item) {
                this.previewDetailImgUrl = item;
                this.visibleDetail = true;
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
                    funName: 'updateCsdjlbItem',
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
                    funName: 'deleteCsdjlbItem',
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
              this.tableHeight = window.innerHeight;
            }
          }
        },
        components: {
          leftPage
        }
    }
</script>
