import axios from 'axios';

export default {
    // state: {
    //     token: localStorage.getItem('user-token') || '',
    //     status: ''
    // },
    // getters: {
    //     isAuthenticated(state) {
    //         return !!state.token;
    //     },
    //     authStatus(state) {
    //         return state.status;
    //     }
    // },
    actions: {
        INIT_APP({ getters, commit, dispatch }, user) {
            console.log('INIT_APP');
            return new Promise((resolve, reject) => {

                axios({ 
                    url: getters.url, 
                    method: 'POST',
                    data: {
                        token: localStorage.getItem('user-token'),
                        queue: [
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
                        ]
                    }
                })
                .then(r => {
                    console.log('front <-- back', r)  

                    commit('setProducts',      r.data.products);
                    commit('setHistory',       r.data.history);
                    commit('setOptions',       r.data.options);
                    commit('setTariffs',       r.data.tariffs);
                    commit('setCategories',    r.data.categories);
                    commit('setCustomers',     r.data.customers);
                    commit('setSubOrders',     r.data.sub_orders);
                    commit('setOrders',        r.data.orders);
                    commit('setAccessories',   r.data.accessories);
                    resolve(r);                        
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        // AUTH_REGISTER({ getters, commit, dispatch}, user) {
        //     return new Promise((resolve, reject) => {
        //         axios({
        //             url: getters.url + '/api/register',
        //             data: user,
        //             method: 'POST'
        //         })
        //         .then(resp => {
        //             const token = resp.data.success.token;
        //             axios.defaults.headers.common['Authorization'] = token;
        //             commit('AUTH_SUCCESS', token);
        //             localStorage.setItem('user-token', token);
        //             resolve(resp);
        //         })
        //         .catch(err => {
        //             commit('AUTH_ERROR', err);                  
        //             localStorage.removeItem('user-token');
        //             reject(err);
        //         });
        //     });
        // },
        // AUTH_LOGOUT({ commit, dispatch }) {
        //     return new Promise((resolve, reject) => {
        //         commit('AUTH_LOGOUT');
        //         localStorage.removeItem('user-token');
        //         delete axios.defaults.headers.common['Authorization'];
        //         resolve();
        //     });
        // }
    },
    // mutations: {
    //     AUTH_REQUEST(state) {
    //         state.status = 'loading';
    //     },
    //     AUTH_SUCCESS(state, token) {
    //         state.status = 'success';
    //         state.token = token;
    //     },
    //     AUTH_ERROR(state) {
    //         state.status = 'error';
    //     },
    //     AUTH_LOGOUT(state) {
    //         state.token = '';
    //         state.status = '';
    //     }
    // }
};