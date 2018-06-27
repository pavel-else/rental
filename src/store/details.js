export default {
    state: {
        showDetails: false,
        currentOrderDetails: {}
    },
    mutations: {
        showDetails(state, order) {
            state.showDetails = true
            state.currentOrderDetails = order
        },
        closeDetails(state) {
            state.showDetails = false
        }
    },
    actions: {
        showDetails({ commit }, order) {
            commit('showDetails', order)
        },
        closeDetails({ commit }) {
            commit('closeDetails')
        },
    },
    getters: {
        show(state) {
            return state.showDetails
        },
        currentOrderDetails(state) {
            return state.currentOrderDetails
        }
    }
}