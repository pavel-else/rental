import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jsonp from 'jsonp'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		results: [1, 2, 3],

		orders: [],
		products: [],
		customers: [],

		count: 1
	},

	getters: {
		results(state) {
			return state.results
		},
		products(state) {
			return state.products
		},
		count(state) {
			return state.count
		}
	},

	mutations: {
		set(state, {type, items}) {
			state[type] = items
		},
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
            	console.log(r)
            })
            .catch(e => {
            	console.log(e)
            })

		}
	}
})

export default store

        // getData(cmds, callback) {
        //     axios({
        //         method: 'post',
        //         url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
        //         data: {
        //             cmds: cmds,
        //         }
        //     })
        //     .then(callback)
        // },
        // update() {
        //     this.getData(['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs'], response => {
        //         this.options = response.data.options;           
        //         this.productsAll = response.data.products;
        //         this.products = this.filterProducts(this.productsAll);
        //         this.orders = response.data.orders;
        //         this.customers = response.data.clients;
        //         this.logs = response.data.logs;
        //         console.log(response.data.options.max_order_id);          
        //     })
        // },