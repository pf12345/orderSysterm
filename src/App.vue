<template>
  <div id="app">
    <div class="layout">
          <div class="layout-ceiling">
              <div class="layout-ceiling-user">
                用户名：{{$root.user.name || ""}}
              </div>
              <div class="layout-ceiling-main">
                  <a href="/login">退出登录</a>
              </div>
          </div>
          <div>
            <router-view class="view left" name="left"></router-view>
            <router-view class="view content" name="content"></router-view>
            <router-view class="view one" name="login"></router-view>
          </div>
          <!-- <div class="layout-copy">
              2016-2017 &copy; 成都乐点
          </div> -->
      </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
        position: fixed;
        bottom: 0;
        left: 240px;
        right: 0;
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
.layout-ceiling-user {
  float: left;
  margin-left: 15px;
  color: #9ba7b5;
}
.ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app .left {
  position: fixed;
  left: 0;
  top: 40PX;
  width: 240px;
  bottom: 0;
}
#app .left > ul {
  height: 100%;
  background: #f5f7f9;
}
#app .content {
  position: fixed;
  left: 240px;
  top: 40PX;
  bottom: 0;
  right: 0;
}
#app .warp_content {
  padding: 20px;
}
#app .top {
  height: 50px;
  line-height: 50px;
  position: relative;
  padding: 0 20px;
  border-bottom: 1px solid #dadada;
}
th, td {
  text-align: center !important;
}
body {
  background: #f5f7f9;
}
</style>
