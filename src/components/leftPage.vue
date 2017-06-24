<template lang="html">
  <div class="leftPage" :class="{'show': show, 'hide': !show}">
    <div class="title">
      <span>
        <slot name="title"></slot>
      </span>
      <span class="close" @click="close" >
        <Icon type="close-round"></Icon>
      </span>

    </div>
    <div class="">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('on-close', this.show);
    }
  }
}
</script>

<style lang="css" scoped>
  .leftPage {
    position: fixed;
    height: 100%;
    width: 600px;
    top: 0;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
    background: #fff;
    z-index: 100;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  .hide {
    right: -610px;
  }
  .show {
    right: 0;
  }
  .title {
    padding: 10px;
    border-bottom: 1px solid #dadada;
  }
  .close {
    float: right;
    margin-top: 3px;
    cursor: pointer;
  }
</style>
