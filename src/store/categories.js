export default {  
    state: {
        categories: []
    },
    mutations: {
        setCategories(state, categories) {
            state.categories = categories
            console.log('set categories')
        }
    },
    actions: {
        setCategories({commit}, categories) {
            commit('setCategories', categories)
        }
    },
    getters: {
        categories(state) {
            return state.categories
        },
    }
}