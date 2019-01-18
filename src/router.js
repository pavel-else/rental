import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
//import Home from './views/Home.vue'

import Home      from './components/Desktop'
import History   from './components/History'
import Customers from './components/Customers'
import Options   from './components/Options'
import AdminPage   from '@/views/AdminPage'

const Login = () => import('@/views/Login')

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/Login');
};

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
    {
      path: '/login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },  
  ]
})
