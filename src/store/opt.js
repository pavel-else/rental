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
            rent_min_time: 1800000, //min
            rent_round_bill: 0,

            lastOrderID: null,
            lastOrderTime: null,
            lastOrderInterval: 180000, //ms       

            now: Date.now(),
        },
    
        depositList: [
            {
                id_rent: 1,
                name: 'Паспорт'
            },
            {
                id_rent: 2,
                name: 'Водительское'
            },
            {
                id_rent: 3,
                name: 'Военный билет'
            },
            {
                id_rent: 4,
                name: 'Загран. паспорт'
            },
            {
                id_rent: 5,
                name: 'Мед. полис'
            },
            {
                id_rent: 6,
                name: 'Снилс'
            },
            {
                id_rent: 7,
                name: 'Студентческий'
            },
            {
                id_rent: 8,
                name: 'Водительское'
            },
            {
                id_rent: 9,
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
        setOptions(state, options) {
            if (!options) {
                return
            }
            
            options.map(opt => {
                state.options[opt.name] = opt.value
            })

            console.log('set options')
        },
        setOption(state, {option, value}) {
            if (!option) {
                return
            }

            state.options[option] = value

            console.log('setOption', option, state.options[option])
        },
        now(state, date) {
            state.options.now = date
        }
    },

    actions: {
        startTimer({commit}) {
            setInterval(() => {commit('now', Date.now())}, 1000)
        },
    },

    getters: {
        now(state) {
            return state.options.now
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
    }
}