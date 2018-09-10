export default {
    state: {
        accessories: []    
    },

    mutations: {
        setAccessories(state, accessories) {
            state.accessories = accessories
            console.log('set accessories')
        }
    },
    actions: {
        setAccessories({commit}, accessories) {
            commit('setAccessories', accessories)
        }
    },
    getters: {
        accessories(state) {
            return state.accessories
        }
    }
}