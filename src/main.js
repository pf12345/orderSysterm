// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css'; // 使用 CSS
import axios from 'axios'

Vue.use(iView);
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
});

let AJAXDOMAIN = '';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  data: function() {
    return {
      serverUrl: AJAXDOMAIN,
      msg: null
    }
  },
  methods: {
    ajaxPost({funName, params}, succ, err) {
      let _this = this;
      this.$Loading.start();
      // if(this.msg) {
      //   this.msg();
      // }
      // this.msg = this.$Message.loading({
      //   content: '正在加载中...',
      //   duration: 0
      // });
      axios.post(AJAXDOMAIN + '/' + funName, params)
        .then(function(response) {
          _this.$Loading.finish();
          // _this.msg();
          if (succ && typeof succ === 'function') {
            succ(response.data.data, response.data);
          }
        })
        .catch(function(error) {
          _this.$Loading.error();
          // _this.msg();
          if (err && typeof err === 'function') {
            err(error);
          }
        });
    },
    ajaxGet({funName, params}, succ, err) {
      let _this = this;
      let url = AJAXDOMAIN + '/' + funName;
      if (params) {
        url += '?'
        for (let key in params) {
          url += (key + '=' + params[key] + '&')
        }
      }
      this.$Loading.start();
      // if(this.msg) {
      //   this.msg();
      // }
      // this.msg = this.$Message.loading({
      //   content: '正在加载中...',
      //   duration: 0
      // });
      axios.get(url)
        .then(function(response) {
          _this.$Loading.finish();
          // _this.msg();
          if (succ && typeof succ === 'function') {
            succ(response.data.data, response.data);
          }
        })
        .catch(function(error) {
          _this.$Loading.error();
          // _this.msg();
          if (err && typeof err === 'function') {
            err(error);
          }
        });
    },
    getLocalDate(date) {
      if (date) {
        return new Date(date).toLocaleDateString().replace(/\//ig, '-')
      }
      return new Date().toLocaleDateString().replace(/\//ig, '-')
    }
  }
})
