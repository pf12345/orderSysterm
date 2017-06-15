<template>
  <div class="">
    <Menu :theme="theme3" width="240px">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-cloud-upload-outline"></Icon>
                        网络平台数据
                    </template>
                    <Menu-item name="1-1">携程</Menu-item>
                    <Menu-item name="1-2">去哪儿</Menu-item>
                    <Menu-item name="1-3">途牛</Menu-item>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-pulse"></Icon>
                        网络平台数据统计
                    </template>
                    <Menu-item name="2-1">乐点销售</Menu-item>
                    <Menu-item name="2-2">乐点平台</Menu-item>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                      <Icon type="arrow-graph-up-right"></Icon>
                      统计分析
                  </template>
                  <Menu-item name="3-1">单日下单分析</Menu-item>
                  <Menu-item name="3-2">累计下单分析</Menu-item>
                </Submenu>
                <Submenu name="4">
                  <template slot="title">
                      <Icon type="tshirt-outline"></Icon>
                      酒店管理
                  </template>
                  <Menu-item name="4-1">酒店数据管理</Menu-item>
                  <Menu-item name="4-2">数据对比</Menu-item>
                </Submenu>
            </Menu>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                theme3: 'light'
            }
        }
    }
</script>
