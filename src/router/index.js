import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Tuniu from '@/components/Tuniu'
import meituan from '@/components/meituan'
import checkInStatic from '@/components/checkInStatic'
import Login from '@/components/Login'
import Menu from '@/components/Menu'
import Zdxscltzjl from '@/components/zdxscltzjl'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      components: {
        login: Login
      }
    },
    {
      path: '/',
      name: 'Index',
      components: {
        content: Index,
        left: Menu
      }
    },
    {
      path: '/tuniu',
      name: 'Tuniu',
      components: {
        content: Tuniu,
        left: Menu
      }
    },
    {
      path: '/meituan',
      name: 'meituan',
      components: {
        content: meituan,
        left: Menu
      }
    },
    {
      path: '/checkInStatic',
      name: 'checkInStatic',
      components: {
        content: checkInStatic,
        left: Menu
      }
    },
    {
      path: '/zdxscltzjl',
      name: 'zdxscltzjl',
      components: {
        content: Zdxscltzjl,
        left: Menu
      }
    }
  ]
})
