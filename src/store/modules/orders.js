import axios from 'axios';
export default {
    state: {
        orders: [],
    },
    getters: {
        orders(state) {
            return state.orders;
        }
    },
    mutations: {
        orders(state, orders) {
            console.log('commit: orders', orders);
            state.orders = orders;
        }
    },
    actions: {
        getorders({ commit, getters }) {
            console.log('dispatch: getorders');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getorders' }
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
        changeOrder({ commit, getters }, order) {
            console.log('dispatch: changeOrder');

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
        }
    },
}