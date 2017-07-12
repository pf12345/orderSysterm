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

// let AJAXDOMAIN = 'http://127.0.0.1:8033';
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
      msg: null,
      user: window.user || {}
    }
  },
  methods: {
    ajaxPost({funName, params}, succ, err) {
      let _this = this;
      this.$Loading.start();
      if(this.msg) {
        this.msg();
      }
      this.msg = this.$Message.loading({
        content: '正在加载中...',
        duration: 0
      });
      axios.post(AJAXDOMAIN + '/' + funName, params)
        .then(function(response) {
          _this.$Loading.finish();
          _this.msg();
          if (succ && typeof succ === 'function') {
            if(response.data.result == 'TRUE') {
              succ(response.data.data, response.data);
            }else {
              if(response.data.message) {
                _this.$Message.error(response.data.message);
              }
            }
          }
        })
        .catch(function(error) {
          _this.$Loading.error();
          _this.msg();
          if (err && typeof err === 'function') {
            err(error);
          } else {
            _this.$Message.error('数据错误，请刷新重试');
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
      if(this.msg) {
        this.msg();
      }
      this.msg = this.$Message.loading({
        content: '正在加载中...',
        duration: 0
      });
      axios.get(url)
        .then(function(response) {
          _this.$Loading.finish();
          _this.msg();
          if (succ && typeof succ === 'function') {
            if(response.data.result == 'TRUE') {
              succ(response.data.data, response.data);
            }else {
              if(response.data.message) {
                _this.$Message.error(response.data.message);
              }else {
                _this.$Message.error('数据错误，请刷新重试');
              }
            }
          }
        })
        .catch(function(error) {
          _this.$Loading.error();
          _this.msg();
          if (err && typeof err === 'function') {
            err(error);
          } else {
            _this.$Message.error('数据错误，请刷新重试');
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
