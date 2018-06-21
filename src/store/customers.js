export default {
	state: {
		customers: []
	},
	mutations: {
		setCustomers(state, customers) {
			state.customers = customers
		}
	},
	getters: {
		customers(state) {
			return state.customers
		}
	}
}