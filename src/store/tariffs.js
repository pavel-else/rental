export default {
    state: {
        tariffs: {
            1: [0, 120, 100, 80, 80, 80, 80],
            2: [0, 80,  80,  80, 80, 80, 80],
        },

        tariffs_new: []    
    },

    mutations: {
        setTariffs(state, tariffs) {
            state.tariffs_new = tariffs
            console.log('set tariffs')
        }
    },
    actions: {
        setProducts({commit}, tariffs) {
            commit('setTariffs', tariffs)
        }
    },
    getters: {
        tariffs(state) {
            return state.tariffs_new
        },
        tariffsList(state) {
            return state.tariffs_new
        }
    }
}