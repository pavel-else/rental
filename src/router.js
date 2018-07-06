import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Desktop from './components/desktop/Desktop'
import History from './components/History/history'
import Customers from './components/Customers/Customers'
import Options from './components/Options/Options'
    import Tariffs from './components/Options/Tariffs'

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
    {
        path: '/tariffs',
        component: Tariffs
    }
]

export const router = new VueRouter({
    routes,
    mode: 'history'
})