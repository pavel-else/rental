import axios from 'axios';
export default {
    state: {
        subOrders: [],
        activeSubOrders: []
    },
    getters: {
        subOrders(state) {
            return state.subOrders;
        },
        activeSubOrders(state) {
            return state.activeSubOrders;
        },
    },
    mutations: {
        subOrders(state, subOrders) {
            console.log('commit: subOrders', subOrders);
            state.subOrders = subOrders;
        },
        activeSubOrders(state, activeSubOrders) {
            console.log('commit: activeSubOrders', activeSubOrders);
            state.activeSubOrders = activeSubOrders;
        },
    },
    actions: {
        getSubOrders({ commit, getters }) {
            console.log('dispatch: getSubOrders');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getSubOrders' }
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
                    commit('subOrders', resp.data.sub_orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        getActiveSubOrders({ commit, getters }) {
            console.log('dispatch: getActiveSubOrders');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getActiveSubOrders' }
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
                    commit('activeSubOrders', resp.data.active_sub_orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        changeSubOrders({ commit, getters }, subOrders) {
            console.log('dispatch: changeSubOrders');

            return new Promise((resolve, reject) => {
                const queue = subOrders.map(i => {
                    return { cmd: 'changeSubOrder', value: i };
                });
                queue.push({ cmd: 'getSubOrders'});

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
                    commit('subOrders', resp.data.sub_orders);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            }); 
        },
        changeSubOrder({ commit, getters }, subOrder) {
            console.log('dispatch: changeSubOrder', subOrder);

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'changeSubOrder', value: subOrder },
                    { cmd: 'getSubOrders'}
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
                    commit('subOrders', resp.data.sub_orders);
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