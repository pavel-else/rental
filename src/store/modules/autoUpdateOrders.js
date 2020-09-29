export default {
    state: {
        functionSetInterval: null,  // хранит в себе setInterval
    },
    getters: {},
    mutations: {
        startAutoUpdateOrders(state, functionSetInterval) {
            state.functionSetInterval = functionSetInterval;
        },
        stopAutoUpdateOrders(state) {
            clearInterval(state.functionSetInterval);
            state.functionSetInterval = null;
        }
    },
    actions: {
        startAutoUpdateOrders({ commit, dispatch }, intervalInMs) {
            commit('startAutoUpdateOrders', setInterval(() => {
                const queue = [
                    { cmd: 'getActiveOrders' },
                    { cmd: 'getActiveSubOrders' }
                ];

                dispatch('multipleRequest', queue);
            }, intervalInMs));
        },
        stopAutoUpdateOrders({ commit }) {
            commit('stopAutoUpdateOrders');
        },
    }
}