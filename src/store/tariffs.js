export default {
    state: {
        tariffs: {
            1: [0, 120, 100, 80, 80, 80, 80],
            2: [0, 80,  80,  80, 80, 80, 80],
        },

        tariffs_new: [
            {
                id: 1,
                type: 'h',
                name: 'T-120',
                h: {
                    1: 120,
                    2: 100,
                    3: 80,
                    4: 80,
                    5: 80
                },
                min: 60,
                max: 500,
                note: 'Почасовой'
            },
            {
                id: 2,
                type: 'd',
                name: 'd-800',
                h: {},
                min: 0,
                max: 800,
                note: 'Сутки'
            },
            {
                id: 3,
                type: 'f',
                name: 'Утро',
                h: {},
                min: 0,
                max: 300,
                note: 'C 8-00 до 11-00'
            },
        ]    
    },
    getters: {
        tariffs(state) {
            return state.tariffs
        },
        tariffsList(state) {
            return state.tariffs_new
        }
    }
}