import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'

import Home      from './components/Desktop'
import History   from './components/History'
import Customers from './components/Customers'
import Options   from './components/Options'
import AdminPage   from '@/views/AdminPage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '' || '/' || 'home',
        name: 'home',
        component: Home
    },
    {
        path: '/customers',
        component: Customers
    },
    {
        path: '/history',
        component: History
    },
    {
        path: '/options',
        component: Options
    },
    {
        path: '/admin',
        component: AdminPage
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
