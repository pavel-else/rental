import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Desktop   from './components/Desktop'
import History   from './components/History'
import Customers from './components/Customers'
import Options   from './components/Options'

const routes = [
    {
        path: '',
        component: Desktop
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
]

export const router = new VueRouter({
    routes,
    //mode: 'history'
    // для реализации этой опции для продакшна 
    // необходима спец.настройка сервера
})