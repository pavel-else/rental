export default {
	state: {
		customers: []
	},
	mutations: {
		setCustomers(state, customers) {
			state.customers = customers
			console.log('set customers')
		}
	},
	getters: {
		customers(state) {
			return state.customers
		}
	}
}