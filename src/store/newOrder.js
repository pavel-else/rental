export default {
	state: {
        showNewOrder: false,		
	},
	mutations: {
        showNewOrder(state, item) {
            state.showNewOrder = item
        },
	},
	actions: {
        showNewOrder({commit}, item) {
            commit('showNewOrder', item)
        },
	},
	getters: {
		showNewOrder(state) {
			return state.showNewOrder
		}
	}
}