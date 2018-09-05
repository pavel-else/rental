export default {  
    state: {
        orderProducts: []
    },
    mutations: {
        setOrderProducts(state, products) {
            state.orderProducts = products
            console.log('set orderProducts')
        }
    },
    actions: {
        setOrderProducts({commit}, products) {
            commit('setOrderProducts', products)
        }
    },
    getters: {
        orderProducts: state => state.orderProducts
    }
}


