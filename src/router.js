import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import History from './components/history'

const routes = [
	{
		path: 'history',
		component: History
	}
]

export const router = new VueRouter({
	routes,
	mode: 'history'
})