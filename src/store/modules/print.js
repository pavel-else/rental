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

            return new Promise((resolve, reject) => {
                commit('orderToPrint', order);
            });
        },
        unsetOrderToPrint({ commit }, order) {
            console.log('dispatch: unsetOrderToPrint');

            return new Promise((resolve, reject) => {
                commit('orderToPrint', null);
            });
        },
    }
}