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
      <Table :height="tableHeight" :columns="columns" :data="data" @on-row-click="gotoDetail"></Table>
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
            <Input v-model="formItem.hotel" placeholder="请输入"></Input>
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
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>


    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title">测试单记录表详情</span>
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
                visible: false,
                visibleDetail: false,
                detail: {
                  files: ['']
                },
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
                    test_channel: '' //测试渠道
                },
                ruleValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ],
                  test_channel: [
                    { required: true, message: '测试渠道不能为空', trigger: 'change' }
                  ],
                  // entry_date_day: [
                  //   { required: true, message: '录入时间不能为空', trigger: 'change' }
                  // ],
                  // entry_date_time: [
                  //   { required: true, message: '录入时间不能为空', trigger: 'change' }
                  // ],
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

                    },
                    {
                        title: '测试渠道',
                        key: 'test_channel'
                    },
                    {
                        title: '价格',
                        key: 'price',
                        width: 120
                    }
                ],
                data: []
            }
        },
        created() {
          let _this = this;
          this.$root.ajaxGet({
            funName: 'getCsdjlbList'
          }, function(res) {
            _this.data =  res;
          })
        },
        methods: {
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
