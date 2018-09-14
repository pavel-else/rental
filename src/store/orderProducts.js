export default {
    state: {
        subOrders: []
    },
    mutations: {
        setSubOrders(state, subOrders) {
            state.subOrders = subOrders
            console.log('set subOrders')
        }
    },
    actions: {
        setSubOrders({commit}, subOrders) {
            commit('setSubOrders', subOrders)
        }
    },
    getters: {
        orderProducts: state => state.subOrders,
        subOrders: state => state.subOrders
    }
}