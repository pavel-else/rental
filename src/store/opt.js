export default {
    state: {
        url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
        cmds: [
            'getProducts',
            'getOrders', 
            'getClients', 
            'getHistory', 
            'getTariffs', 
            'getCategories', 
            'getOptions', 
            'getLogs'
        ],

        options: {
            rent_min_time: 0, //ms
            rent_round_bill: 0,          
        },

        now: new Date(),
        max_order_id: Number,
        new_order_id: Number,
        max_tariff_id: Number,

        depositList: [
            {
                id: 1,
                name: 'Паспорт'
            },
            {
                id: 2,
                name: 'Водительское'
            },
            {
                id: 3,
                name: 'Военный билет'
            },
            {
                id: 4,
                name: 'Загран. паспорт'
            },
            {
                id: 5,
                name: 'Мед. полис'
            },
            {
                id: 6,
                name: 'Снилс'
            },
            {
                id: 7,
                name: 'Студентческий'
            },
            {
                id: 8,
                name: 'Водительское'
            },
            {
                id: 9,
                name: 'Другое'
            }
        ],

        promotions: [
            {
                id: 1,
                name: '30%',
                discount: 30
            },
            {
                id: 2,
                name: 'Студент - 10%',
                discount: 10
            }
        ],

        accessories: [
            {
                id: 1,
                name: 'Детское кресло'
            },
            {
                id: 2,
                name: 'Шлем'
            }
        ]

    },
    mutations: {
        setOpt(state, options) {
            options.map(opt => {
                state.options[opt.name] = opt.value
            })

            console.log('set options')
        },
        now(state, date) {
            state.now = date
        },
        rent_min_time(state, time) {
            state.rent_min_time = time * 60 * 1000
        },

        rent_round_bill(state, round) {
            state.rent_round_bill = round
        }

    },
    actions: {
        startTimer({commit}) {
            setInterval(() => {commit('now', new Date())}, 3000)
        },
        rent_min_time({commit}, time) {
            commit('rent_min_time', time)
        },
        rent_round_bill({commit}, round) {
            commit('rent_round_bill', round)
        }
    },
    getters: {
        now(state) {
            return state.now
        },
        options(state) {
            return state.options
        },

        //depricated
        depositList(state) {
            return state.depositList
        },
        deposits(state) {
            return state.depositList
        },
        promotions(state) {
            return state.promotions
        },
        accessories(state) {
            return state.accessories
        },
        rentMinTime(state) {
            return state.options.rent_min_time
        },
        rent_round_bill(state) {
            return state.options.rent_round_bill
        }
    }
}