export default {
	state: {
		customers: []
	},
	mutations: {
		setCustomers(state, customers) {
			state.customers = customers ? customers.map(i => {
				i.id = Number(i.id)
				i.id_rent = Number(i.id_rent)

				return i
			}) : []
			console.log('set customers')
		}
	},
	getters: {
		customers(state) {
			return state.customers
		}
	}
}