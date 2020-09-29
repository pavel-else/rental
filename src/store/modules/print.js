export default {  
    state: {
        orderToPrint: null,
    },
    getters: {
        orderToPrint(state) {
            return state.orderToPrint;
        }
    },
    mutations: {
        orderToPrint(state, order) {
            state.orderToPrint = order;
        }
    },
    actions: {
        setOrderToPrint({ commit }, order) {
            commit('orderToPrint', order);
        },
        unsetOrderToPrint({ commit }) {
            commit('orderToPrint', null);
        },
    }
}