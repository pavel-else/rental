export default {
    state: {
        url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
        cmds: ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getHistory', 'getLogs'],
        now: new Date(),
        max_order_id: Number,
        new_order_id: Number,

        depositList: {
            1: 'Паспорт',
            2: 'Водительское',
            3: 'Военный билет',
            4: 'Загран. паспорт',
            5: 'Мед. полис',
            6: 'Снилс',
            7: 'Студентческий',
            8: 'Удостоверение',
            9: 'Другое',
        }
    },
    mutations: {
        setOpt(state, opt) {
            for (let prop in opt) {
                state[prop] = opt[prop]
            }
            console.log('set options')
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
        },
        options(state) {
            return state
        },
        depositList(state) {
            return state.depositList
        }
    }
}