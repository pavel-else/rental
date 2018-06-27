import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Desktop from './components/desktop/Desktop'
import History from './components/history'

const routes = [
	{
		path: '',
		component: Desktop
	},
	{
		path: '/history',
		component: History
	},
]

export const router = new VueRouter({
	routes,
	mode: 'history'
})