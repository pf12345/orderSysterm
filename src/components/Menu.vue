<template>
  <div class="">
    <Menu :theme="theme3" width="240px" @on-select="selectItem">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-cloud-upload-outline"></Icon>
                        数据录入
                    </template>
                    <Menu-item name="1-1" >携程</Menu-item>
                    <Menu-item name="1-2">美团</Menu-item>
                    <Menu-item name="1-3">途牛</Menu-item>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-pulse"></Icon>
                        数据统计
                    </template>
                    <Menu-item name="2-1">每日新订订单量及订单间夜</Menu-item>
                    <Menu-item name="2-2">每日入住间夜</Menu-item>
                    <Menu-item name="2-3">入住数据分析</Menu-item>
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
                      数据监控及记录保存
                  </template>
                  <Menu-item name="4-1">当日价格监控记录簿</Menu-item>
                  <Menu-item name="4-2">重大销售策略调整记录表</Menu-item>
                  <Menu-item name="4-3">测试单记录表</Menu-item>
                </Submenu>

                <Submenu name="5">
                  <template slot="title">
                      <Icon type="tshirt-outline"></Icon>
                      酒店管理
                  </template>
                  <Menu-item name="5-1">酒店数据管理</Menu-item>
                  <Menu-item name="5-2">数据对比</Menu-item>
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
        },
        methods: {
          selectItem(val) {
            switch (val) {
              case '1-1':
                window.location.href = '/#/';
                break;
              case '1-2':
                window.location.href = '/#/meituan';
                break;
              case '1-3':
                window.location.href = '/#/tuniu';
                break;
              case '2-3':
                window.location.href = '/#/checkInStatic';
                break;
              case '4-2':
                window.location.href = '/#/zdxscltzjl';
                break;
              default:

            }
          }
        }
    }
</script>
