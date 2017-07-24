<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>当日价格监控记录簿</h3>
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
      <span slot="title">新建当日价格监控记录簿</span>
      <div slot="content" class="addContent">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">
        <Form-item label="酒店名称" prop="hotel">
            <Select v-model="formItem.hotel" placeholder="请选择酒店名称">
                <Option v-for="hotel in hotels" :value="hotel.name_all" :key="hotel.key">{{hotel.name_all}}</Option>

            </Select>
        </Form-item>
        <Form-item label="携程监控" prop="xc">
            <Select v-model="formItem.xc" placeholder="请选择Y/N" @on-change="selectChange('xc')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="xc_cause" v-if="formItem.xc === 'N'">
            <Input v-model="formItem.xc_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="去哪儿监控" prop="qunaer" >
            <Select v-model="formItem.qunaer" placeholder="请选择Y/N" @on-change="selectChange('qunaer')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="qunaer_cause" v-if="formItem.qunaer === 'N'">
            <Input v-model="formItem.qunaer_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="艺龙监控" prop="yinong" >
            <Select v-model="formItem.yinong" placeholder="请选择Y/N" @on-change="selectChange('yinong')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="yinong_cause" v-if="formItem.yinong === 'N'">
            <Input v-model="formItem.yinong_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="途牛监控" prop="tuniu" >
            <Select v-model="formItem.tuniu" placeholder="请选择Y/N" @on-change="selectChange('tuniu')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="tuniu_cause" v-if="formItem.tuniu === 'N'">
            <Input v-model="formItem.tuniu_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="同程监控" prop="tongcheng" >
            <Select v-model="formItem.tongcheng" placeholder="请选择Y/N" @on-change="selectChange('tongcheng')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="tongcheng_cause" v-if="formItem.tongcheng === 'N'">
            <Input v-model="formItem.tongcheng_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="美团酒店监控" prop="meituanhotel" >
            <Select v-model="formItem.meituanhotel" placeholder="请选择Y/N" @on-change="selectChange('meituanhotel')">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="劣势原因" prop="meituanhotel_cause" v-if="formItem.meituanhotel === 'N'">
            <Input v-model="formItem.meituanhotel_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="submitAdd('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelAdd">取消</Button>
        </Form-item>
    </Form>
      </div>

    </left-page>


    <left-page :show="showDetail" @on-close="closeDetail">
      <span slot="title" class="detailTitle">测试单记录表详情 <a @click="addSolveData">修改解决情况</a></span>
      <div slot="content" class="addContent">
        <div class="item">
          <h4>录入时间</h4>
          <p>{{detail.created}}</p>
        </div>
        <div class="item">
          <h4>酒店名称</h4>
          <p>{{detail.hotel}}</p>
        </div>
        <div class="item">
          <h4>携程监控</h4>
          <p>{{detail.xc}}</p>
        </div>
        <div class="item" v-if="detail.xc_cause">
          <h4>携程劣势原因</h4>
          <p>{{detail.xc_cause}}</p>
        </div>
        <div class="item">
          <h4>去哪儿监控</h4>
          <p>{{detail.qunaer}}</p>
        </div>
        <div class="item" v-if="detail.qunaer_cause">
          <h4>去哪儿劣势原因</h4>
          <p>{{detail.qunaer_cause}}</p>
        </div>
        <div class="item">
          <h4>艺龙监控</h4>
          <p>{{detail.yinong}}</p>
        </div>
        <div class="item" v-if="detail.yinong_cause">
          <h4>艺龙劣势原因</h4>
          <p>{{detail.yinong_cause}}</p>
        </div>
        <div class="item">
          <h4>途牛监控</h4>
          <p>{{detail.tuniu}}</p>
        </div>
        <div class="item" v-if="detail.tuniu_cause">
          <h4>途牛劣势原因</h4>
          <p>{{detail.tuniu_cause}}</p>
        </div>
        <div class="item">
          <h4>同程监控</h4>
          <p>{{detail.tongcheng}}</p>
        </div>
        <div class="item" v-if="detail.tongcheng_cause">
          <h4>同程劣势原因</h4>
          <p>{{detail.tongcheng_cause}}</p>
        </div>
        <div class="item">
          <h4>美团酒店监控</h4>
          <p>{{detail.meituanhotel}}</p>
        </div>
        <div class="item" v-if="detail.meituanhotel_cause">
          <h4>美团劣势原因</h4>
          <p>{{detail.meituanhotel_cause}}</p>
        </div>
        <h2 style="margin: 10px;" v-if="detail.isSolve">解决情况</h2>
        <div class="item" v-if="detail.isSolve">
          <h4>是否解决</h4>
          <p>{{detail.isSolve}}</p>
        </div>
        <div class="item" v-if="detail.solve_cause">
          <h4>原因</h4>
          <p>{{detail.solve_cause}}</p>
        </div>
      </div>
    </left-page>

    <Modal
        v-model="showModal"
        title="修改解决情况"
        @on-ok="ok"
        width="700"
        @on-cancel="cancel">
        <Form :model="formItem" ref="formItem" :label-width="100" :rules="ruleValidate">

        <Form-item label="是否解决">
            <Select v-model="formItem.isSolve" placeholder="请选择Y/N">
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
            </Select>
        </Form-item>
        <Form-item label="原因" prop="solve_cause">
            <Input v-model="formItem.solve_cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="如果没解决，请输入未解决原因"></Input>
        </Form-item>
      </Form>
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
    .detailTitle a {
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
                showModal: false,
                visible: false,
                visibleDetail: false,
                detail: {},
                hotels: [],
                formItem: {
                    xc: '',
                    xc_cause: '',
                    tuniu: '',
                    tuniu_cause: '',
                    qunaer: '',
                    qunaer_cause: '',
                    yinong: '',
                    yinong_cause: '',
                    hotel: '',
                    tongcheng: '',
                    tongcheng_cause: '',
                    meituanhotel: '',
                    meituanhotel_cause: '',
                    created: '',
                    isSolve: '',
                    solve_cause: ''
                },
                ruleValidate: {
                  hotel: [
                    { required: true, message: '酒店不能为空', trigger: 'change' }
                  ]
                },
                columns: [
                    {
                        title: '酒店名称',
                        key: 'hotel',
                        width: 200
                    },
                    {
                        title: '创建时间',
                        key: 'created',
                        width: 150
                    },
                    {
                        title: '携程',
                        key: 'xc',
                    },
                    {
                        title: '去哪儿',
                        key: 'qunaer',
                    },
                    {
                        title: '艺龙',
                        key: 'yinong',
                    },
                    {
                        title: '途牛',
                        key: 'xc',
                    },
                    {
                        title: '同程',
                        key: 'tongcheng',
                    },
                    {
                        title: '美团酒店',
                        key: 'meituanhotel',
                    },
                ],
                data: []
            }
        },
        created() {
          let _this = this;
          this.$root.ajaxGet({
            funName: 'getDrjgkjlbList'
          }, function(res) {
            _this.data =  res;
          })
          this.getHotelList();
        },
        methods: {
            show_add() {
              this.showAdd = true;
            },
            getHotelList() {
              var _this = this;
              this.$root.ajaxGet({
                funName: 'getHotelList'
              }, function(res) {
                _this.hotels = res
              })
            },
            close(value) {
              this.showAdd = !value;
            },
            closeDetail(value) {
              this.showDetail = !value;
            },
            cancel() {
              this.showModal = false;
            },
            addSolveData() {
              this.showModal = true;
            },
            ok() {
              let _this = this;
              if(this.formItem.isSolve) {
                this.$root.ajaxPost({
                  funName:'updateDrjgkjlbItem',
                  params: {
                    _id: _this.detail._id,
                    isSolve: _this.formItem.isSolve,
                    solve_cause: _this.formItem.solve_cause
                  }
                }, function(res) {
                  _this.gotoDetail(_this.detail);
                  _this.$Message.info('成功修改解决情况！');
                  _this.showModal = false;
                })
              }else {
                this.$Message.error('请输入相关数据!');
              }

            },
            submitAdd(name) {
              let _this = this;
              this.$refs[name].validate((valid) => {
                if (valid) {
                  this.$root.ajaxPost({
                    funName:'saveDrjgkjlbItem',
                    params: {
                      data: this.formItem
                    }
                  }, function(res) {
                    _this.data.push(res);
                    _this.$Message.info('成功添加！');
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
                funName:'getDrjgkjlbDetail',
                params: {
                  _id: item._id
                }
              }, function(res) {
                let detail = res;
                _this.detail = detail;
                _this.formItem.isSolve = detail.isSolve;
                _this.formItem.solve_cause = detail.solve_cause;
                _this.showDetail = true;
              })
            },
            selectChange(type) {
              if(this.formItem[type] === 'Y') {
                this.formItem[type + '_cause'] = '';
              }
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
