import axios from 'axios';

export default {
    state: {        
        initAppStatus: 'not init', // loading || inited
    },
    getters: {
        isAppInited(state) {
            return state.initAppStatus === 'inited';
        },
    },
    actions: {
        INIT_APP({ getters, commit, dispatch }, user) {
            if (!getters.isAppInited) {
                console.log('inited = ', getters.isAppInited)

                commit('INIT_APP_STATUS', 'loading');

                return new Promise((resolve, reject) => {
                    const queue = [
                        { cmd: 'getProducts', value: '' },
                        { cmd: 'getSubOrders', value: '' },
                        { cmd: 'getOrders', value: '' },
                        { cmd: 'getCustomers', value: '' },
                        { cmd: 'getHistory', value: '' },
                        { cmd: 'getTariffs', value: '' },
                        { cmd: 'getCategories', value: '' },
                        { cmd: 'getOptions', value: '' },
                        { cmd: 'getLogs', value: '' },
                        { cmd: 'getAccessories', value: '' },
                        { cmd: 'getHeaders', value: '' },
                        { cmd: 'getRentalPointInfo', value: '' },
                        { cmd: 'getGeneralSettings', value: '' },
                    ];
                    const token = localStorage.getItem('user-token');

                    console.log('front --> back', queue, token);
                    
                    axios({ 
                        url: getters.url, 
                        method: 'POST',
                        data: {
                            token,
                            queue
                        }
                    })
                    .then(r => {
                        console.log('front <-- back', r)  

                        commit('products',      r.data.products);
                        commit('setHistory',       r.data.history);
                        commit('setOptions',       r.data.options);
                        commit('tariffs',       r.data.tariffs);
                        commit('setCategories',    r.data.categories);
                        commit('setCustomers',     r.data.customers);
                        commit('setSubOrders',     r.data.sub_orders);
                        commit('setOrders',        r.data.orders);
                        commit('accessories',   r.data.accessories);
                        commit('rentalPointInfo', r.data.rental_point_info);
                        commit('generalSettings', r.data.general_settings);

                        commit('INIT_APP_STATUS', 'inited');
                        console.log('INIT_APP');
                        resolve(r);                        
                    })
                    .catch(err => {
                        console.log(err)
                        commit('INIT_APP_STATUS', 'not init');
                        reject(err);
                    });
                });
            }
        },
        REBOOT_APP_INIT_STATUS({ commit }) {
            commit('SET_APP_INIT_STATUS', 'not init');
        }
    },

    mutations: {
        INIT_APP_STATUS(state, status) {
            state.initAppStatus = status;
        },
        SET_APP_INIT_STATUS(state, status) {
            state.initAppStatus = status;
        },
    }
};