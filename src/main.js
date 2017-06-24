// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
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

let AJAXDOMAIN = 'http://127.0.0.1:8033/';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  methods: {
    ajaxPost({funName, params}, succ, err) {
      let _this = this;
      this.$Loading.start();
      axios.post(AJAXDOMAIN + funName, params)
      .then(function (response) {
        _this.$Loading.finish();
        if(succ && typeof succ === 'function') {
          succ(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(AJAXDOMAIN + funName);
        _this.$Loading.error();
        if(err && typeof err === 'function') {
          err(error);
        }
      });
    },
    ajaxGet({funName}, succ, err) {
      let _this = this;
      this.$Loading.start();
      axios.get(AJAXDOMAIN + funName)
      .then(function (response) {
        _this.$Loading.finish();
        if(succ && typeof succ === 'function') {
          succ(response.data.data);
        }
      })
      .catch(function (error) {
        _this.$Loading.error();
        if(err && typeof err === 'function') {
          err(error);
        }
      });
    }
  }
})
