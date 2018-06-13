import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jsonp from 'jsonp'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		orders: [],
		products: [],
		customers: [],
		options: {
			max_order_id: Number,
		}
	},

	getters: {
		products(state) {
			return state.products
		},
		orders(state) {
			return state.orders
		},
		customers(state) {
			return state.customers
		},
		options(state) {
			return state.options
		},

	},

	mutations: {
		set(state, {type, items}) {
			state[type] = items
		},
		setOrders(state, orders, products) {
			const result = orders.map(item => {
				for (let i = 0; i < item.products.length; i++) {}
					
				return item
				
			})
			state.orders = result
		}
	},

	actions: {
		upd({commit}, cmds) {
			const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

			axios({
                method: 'post',
                url,
                data: {
                    cmds
                }
            })
            .then(r => {
            	commit('set', {type: 'products', items: r.data.products})
            	commit('set', {type: 'customers', items: r.data.clients})
            	commit('set', {type: 'options', items: r.data.options})
            	//commit('set', {type: 'orders', items: r.data.orders})
            	commit('setOrders', r.data.orders, r.data.products)
            	console.log(r)
            })
            .catch(e => {
            	console.log(e)
            })

		}
	}
})

export default store