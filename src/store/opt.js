export default {
    state: {
        url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
        now: new Date(),
        max_order_id: Number,
        new_order_id: Number,
    },
    mutations: {
        setOpt(state, opt) {
            console.log(opt)
            state.opt = opt
        },
        now(state, date) {
            state.now = date
        }
    },
    actions: {
        startTimer({commit}) {
            setInterval(() => {commit('now', new Date())}, 1000)
        }
    },
    getters: {
        now(state) {
            return state.now
        }
    }
}