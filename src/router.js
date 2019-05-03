import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Main              from '@/components/Main';
import History           from '@/components/History';
import Customers         from '@/components/Customers';
import Repairs           from '@/components/Repairs';

import RentalPointInfo from '@/components/Options/RentalPointInfo';
import GeneralSettings from '@/components/Options/GeneralSettings';
import Tariffs         from '@/components/Tariffs';
import Accessories     from '@/components/Accessories';
import Products        from '@/components/Products';
import Monitor         from '@/components/Monitor/Monitor';

const Login = () => import('@/views/Login');
const LoginByToken = () => import('@/components/LoginByToken');
const NotFound = { "template": '<h2>Page Not Found</h2>' };

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
            path: '/',
            component: Main,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/monitor',
            component: Monitor,
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
            path: '/settings',
            redirect: '/settings/main',
            beforeEnter: ifAuthenticated,
            component: {
                render(c) { return c('router-view') }
            },
            children: [
                {
                    path: 'main',
                    component: RentalPointInfo
                },
                {
                    path: 'general',
                    component: GeneralSettings
                },
                {
                    path: 'tariffs',
                    component: Tariffs
                },
                {
                    path: 'products',
                    component: Products
                },
                {
                    path: 'accessories',
                    component: Accessories
                },
            ]
        },
        {
            path: '/repairs',
            component: {
                render(c) { return c('router-view') }
            },
            beforeEnter: ifAuthenticated,
            children: [
                {
                    path: '',
                    component: Repairs
                },
                {
                    path: 'plan',
                    component: () => import('@/components/Repairs/RepairsPlan'),
                },
                {
                    path: 'current',
                    component: () => import('@/components/Repairs/RepairsCurrent'),
                },
                {
                    path: 'history',
                    component: () => import('@/components/Repairs/RepairsHistory'),
                },
                {
                    path: 'settings',
                    component: () => import('@/components/Repairs/RepairsSettings'),
                },
            ]
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
