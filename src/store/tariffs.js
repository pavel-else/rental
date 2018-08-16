export default {
    state: {
        tariffs: []    
    },

    mutations: {
        setTariffs(state, tariffs) {
            state.tariffs = tariffs
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
            return state.tariffs
        }
    }
}