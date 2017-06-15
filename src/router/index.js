import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Menu from '@/components/Menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      components: {
        content: Index,
        left: Menu
      }
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        login: Login
      }
    }
  ]
})
