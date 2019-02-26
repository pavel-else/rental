import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
//import Home from './views/Home.vue'

import Home      from './components/Desktop'
import History   from './components/History'
import Customers from './components/Customers'
import Repairs   from './components/Repairs'
import AdminPage   from '@/views/AdminPage'

import Options   from './components/Options'
import OptionsMain   from '@/components/HelloWorld'

const Login = () => import('@/views/Login');
const LoginByToken = () => import('@/components/LoginByToken');
const NotFound = { template: '<h2>Page Not Found</h2>' };

Vue.use(Router);

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
            component: Home,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/customers',
            component: Customers,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/history',
            component: History,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/options/',
            component: Options,
            beforeEnter: ifAuthenticated,
            children: [
                {
                  path: '/main/',
                  // name: 'Main',
                  component: OptionsMain
                }
            ]
        },
        {
            path: '/repairs',
            component: Repairs,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/admin',
            component: AdminPage,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/login',
            component: Login,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/token/:token',
            component: LoginByToken
        },
        {
            path: '*',
            component: NotFound,
        },
    ]
})
