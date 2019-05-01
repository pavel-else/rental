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
            console.log('commit: orderToPrint', order);
            state.orderToPrint = order;
        }
    },
    actions: {
        setOrderToPrint({ commit }, order) {
            console.log('dispatch: setOrderToPrint', order);
            commit('orderToPrint', order);
        },
        unsetOrderToPrint({ commit }) {
            console.log('dispatch: unsetOrderToPrint');
            commit('orderToPrint', null);
        },
    }
}