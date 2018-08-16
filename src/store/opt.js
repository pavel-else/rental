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
        setOpt(state, options) {
            options.map(opt => {
                state.options[opt.name] = opt.value
            })

            console.log('set options')
        },
        now(state, date) {
            state.now = date
        },


    },
    actions: {
        startTimer({commit}) {
            setInterval(() => {commit('now', new Date())}, 3000)
        },

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
    }
}