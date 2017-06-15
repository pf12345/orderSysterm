<template>
  <div class="">
    <div class="top">
      <Row>
        <Col span="12">
          <h3>网络平台数据-携程</h3>
        </Col>
        <Col span="12">
          <div class="export">
            <Upload action="http://127.0.0.1:8033/exportOrderXC" :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
          </div>
        </Col>
    </Row>
    </div>
    <Table :columns="columns1" :data="data1"></Table>
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
</style>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                columns1: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        },
        methods: {

        }
    }
</script>
