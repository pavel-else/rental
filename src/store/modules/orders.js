import axios from 'axios';
export default {
    state: {
        orders: [],
        activeOrders: [],
    },
    getters: {
        orders(state) {
            return state.orders;
        },
        activeOrders(state) {
            return state.activeOrders;
        }
    },
    mutations: {
        orders(state, orders) {
            console.log('commit: orders', orders);
            state.orders = orders;
        },
        activeOrders(state, activeOrders) {
            console.log('commit: activeOrders', activeOrders);
            state.activeOrders = activeOrders;
        },
        unsetOrders(state) {
            console.log('commit: unsetOrders');
            state.orders = [];
        },
        unsetActiveOrders(state) {
            console.log('commit: unsetActiveOrders');
            state.activeOrders = [];
        },
    },
    actions: {
        getOrders({ commit, getters }) {
            console.log('dispatch: getOrders');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getOrders' }
                ];
                const url = getters.url;
                const token = localStorage.getItem('user-token');

                axios({ 
                    url,
                    data: {
                        queue,
                        token
                    },
                    method: 'POST',
                })
                .then(resp => {
                    console.log(resp)
                    commit('orders', resp.data.orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        getActiveOrders({ commit, getters }) {
            console.log('dispatch: getActiveOrders');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getActiveOrders'}
                ];
                const url = getters.url;
                const token = localStorage.getItem('user-token');

                axios({ 
                    url,
                    data: {
                        queue,
                        token
                    },
                    method: 'POST',
                })
                .then(resp => {
                    console.log(resp)
                    commit('activeOrders', resp.data.active_orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        changeOrder({ commit, getters }, order) {
            console.log('dispatch: changeOrder', order);

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'changeOrder', value: order },
                    { cmd: 'getOrders' }
                ];

                const url = getters.url;
                const token = localStorage.getItem('user-token');

                axios({ 
                    url,
                    data: {
                        queue,
                        token
                    },
                    method: 'POST',
                })
                .then(resp => {
                    console.log(resp)
                    commit('orders', resp.data.orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            }); 
        },
    },
}