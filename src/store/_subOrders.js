export default {
    state: {
        subOrders: []
    },
    mutations: {
        setSubOrders(state, subOrders) {
            state.subOrders = subOrders ? subOrders.map(i => {
                i.id = Number(i.id)
                i.id_rent = Number(i.id_rent)
                return i
            }) : []
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
        subOrders: state => state.subOrders,
        activeSubOrders: state => state.subOrders.filter(item => item.status === 'ACTIVE')
    }
}