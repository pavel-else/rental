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
		},

		newOrder: {
			product: {}
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

		newOrder(state) {
			return state.newOrder
		}

	},

	mutations: {
		set(state, {type, items}) {
			state[type] = items
		},
		setOrders(state, {orders, products}) {
			/*
			* Запись активных ордеров в хранилище
			* Функция подмешивает в массив данные (название продукта) из таблицы Продукты
			* Прогоняем массив Ордеров
			* Прогоняем массив продуктов каждого ордера
			* По id ордера продукта находим в таблице Продукты нужную запись
			* Сохраняем данные в массиве Ордеров
			*/
			const result = orders.map(order => {
				for (var i = 0; i < order.products.length; i++) {
					order.products[i].name = products.find(p => p.id == order.products[i].product_id).name
				}

				return order
			})

			state.orders = result
		},
		newOrder(state, product) {
			state.newOrder.product = product
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
            	commit('setOrders', {orders: r.data.orders, products: r.data.products})
            	console.log(r)
            })
            .catch(e => {
            	console.log(e)
            })
		},

		newOrder({commit}, product) {
			commit('newOrder', product)
		}
	}
})

export default store