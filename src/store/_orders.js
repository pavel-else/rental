export default {
    state: {
        orders: []
    },
    mutations: {
        setOrders(state, orders) {
            state.orders = orders
            
            console.log('set Orders')
        },
    },

    actions: {
        setOrders({commit}, orders) {           
            commit('setOrders', orders)
        },
    },

    getters: {
        orders(state) {
            return state.orders
        },
    }
}