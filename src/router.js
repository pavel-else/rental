import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Desktop from './components/desktop/Desktop'
import History from './components/History/history'
import Customers from './components/Customers/Customers'
import Options from './components/Options/Options'

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
    mode: 'history'
})