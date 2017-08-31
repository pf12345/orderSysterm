import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import orderOriginal from '@/components/orderOriginal'
import Tuniu from '@/components/Tuniu'
import Qunaer from '@/components/qunaer'
import Tongcheng from '@/components/tongcheng'
import meituan from '@/components/meituan'
import other from '@/components/other'
import checkInStatic from '@/components/checkInStatic'
import Login from '@/components/Login'
import Menu from '@/components/Menu'
import Zdxscltzjl from '@/components/zdxscltzjl'
import Csdjlb from '@/components/csdjlb'
import Drjgjkjlb from '@/components/drjgjkjlb'
import EveryDayOrderStatic from '@/components/everyDayOrderStatic'
import EveryDayRoomNightsStatic from '@/components/everyDayRoomNightsStatic'
import CheckInRoomNights from '@/components/checkInRoomNights'
import CheckOutDataStatic from '@/components/checkOutDataStatic'
import CheckOutDataChannelStatic from '@/components/checkOutDataChannelStatic'
import LossOrderStatic from '@/components/LossOrderStatic'
import Location from '@/components/location'
import LocationStatic from '@/components/locationStatic'
import hotelOrders from '@/components/hotelOrders'
import hotelOrderComparison from '@/components/hotelOrderComparison'
import platformOrders from '@/components/platformOrders'
import platformOrderComparison from '@/components/platformOrderComparison'

import AccountManagement from '@/components/accountManagement'
import HotelManagement from '@/components/hotelManagement'
import PlatformManagement from '@/components/platformManagement'

import hotelStatic from '@/components/hotelStatic'
import checkoutRoomNightsStatic from '@/components/checkoutRoomNightsStatic'
import checkoutGrossProfitStatic from '@/components/checkoutGrossProfitStatic'
import checkoutSaleAmountStatic from '@/components/checkoutSaleAmountStatic'

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
        content: orderOriginal,
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
      path: '/other',
      name: 'other',
      components: {
        content: other,
        left: Menu
      }
    },
    {
      path: '/qunaer',
      name: 'qunaer',
      components: {
        content: Qunaer,
        left: Menu
      }
    },
    {
      path: '/tongcheng',
      name: 'tongcheng',
      components: {
        content: Tongcheng,
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
    },
    {
      path: '/csdjlb',
      name: 'csdjlb',
      components: {
        content: Csdjlb,
        left: Menu
      }
    },
    {
      path: '/everyDayOrderStatic',
      name: 'everyDayOrderStatic',
      components: {
        content: EveryDayOrderStatic,
        left: Menu
      }
    },
    {
      path: '/everyDayRoomNightsStatic',
      name: 'everyDayRoomNightsStatic',
      components: {
        content: EveryDayRoomNightsStatic,
        left: Menu
      }
    },
    {
      path: '/drjgjkjlb',
      name: 'drjgjkjlb',
      components: {
        content: Drjgjkjlb,
        left: Menu
      }
    },
    {
      path: '/checkOutDataStatic',
      name: 'checkOutDataStatic',
      components: {
        content: CheckOutDataStatic,
        left: Menu
      }
    },
    {
      path: '/checkOutDataChannelStatic',
      name: 'checkOutDataChannelStatic',
      components: {
        content: CheckOutDataChannelStatic,
        left: Menu
      }
    },
    {
      path: '/lossOrderStatic',
      name: 'lossOrderStatic',
      components: {
        content: LossOrderStatic,
        left: Menu
      }
    },
    {
      path: '/accountManagement',
      name: 'accountManagement',
      components: {
        content: AccountManagement,
        left: Menu
      }
    },
    {
      path: '/hotelManagement',
      name: 'hotelManagement',
      components: {
        content: HotelManagement,
        left: Menu
      }
    },
    {
      path: '/platformManagement',
      name: 'platformManagement',
      components: {
        content: PlatformManagement,
        left: Menu
      }
    },
    {
      path: '/location',
      name: 'Location',
      components: {
        content: Location,
        left: Menu
      }
    },
    {
      path: '/locationStatic',
      name: 'locationStatic',
      components: {
        content: LocationStatic,
        left: Menu
      }
    },
    {
      path: '/hotelOrders',
      name: 'hotelOrders',
      components: {
        content: hotelOrders,
        left: Menu
      }
    },
    {
      path: '/hotelOrderComparison',
      name: 'hotelOrderComparison',
      components: {
        content: hotelOrderComparison,
        left: Menu
      }
    },
    {
      path: '/platformOrders',
      name: 'platformOrders',
      components: {
        content: platformOrders,
        left: Menu
      }
    },
    {
      path: '/platformOrderComparison',
      name: 'platformOrderComparison',
      components: {
        content: platformOrderComparison,
        left: Menu
      }
    },
    {
      path: '/checkInRoomNights',
      name: 'checkInRoomNights',
      components: {
        content: CheckInRoomNights,
        left: Menu
      }
    },
    {
      path: '/hotelStatic',
      name: 'hotelStatic',
      components: {
        content: hotelStatic,
        left: Menu
      }
    },
    {
      path: '/checkoutRoomNightsStatic',
      name: 'checkoutRoomNightsStatic',
      components: {
        content: checkoutRoomNightsStatic,
        left: Menu
      }
    },
    {
      path: '/checkoutGrossProfitStatic',
      name: 'checkoutGrossProfitStatic',
      components: {
        content: checkoutGrossProfitStatic,
        left: Menu
      }
    },
    {
      path: '/checkoutSaleAmountStatic',
      name: 'checkoutSaleAmountStatic',
      components: {
        content: checkoutSaleAmountStatic,
        left: Menu
      }
    }
  ]
})
