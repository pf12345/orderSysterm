<template>
  <div id="app">
    <router-view class="view left" name="left"></router-view>
    <router-view class="view content" name="content"></router-view>
    <router-view class="view one" name="login"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app .left {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  bottom: 0;
}
#app .left > ul {
  height: 100%;
}
#app .content {
  position: fixed;
  left: 240px;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 0 20px 20px;
}
</style>
