import axios from 'axios';

export default {
    state: {
        repairs: [],
        repairTypes: []
    },
    getters: {
        repairs(state) {
            return state.repairs;
        },
        repairTypes(state) {
            return state.repairTypes;
        }
    },
    mutations: {
        repairs(state, repairs) {
            console.log('commit: repairs', repairs);
            state.repairs = repairs;
        },
        repairTypes(state, repairTypes) {
            console.log('commit: repairTypes', repairTypes);
            state.repairTypes = repairTypes;
        }
    },
    actions: {
        getRepairs({ dispatch, commit, getters }) {
            console.log('dispatch: getRepairs');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getRepairs' },
                    { cmd: 'getRepairTypes' },
                    { cmd: 'getProducts' },
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
                    commit('repairs', resp.data.repairs);
                    commit('repairTypes', resp.data.repair_types);
                    commit('products', resp.data.products);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        SET_REPAIR({ commit, getters }, repair) {
            console.log('SET_REPAIR');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'setRepair', value: repair },
                    { cmd: 'getRepairs' },
                    { cmd: 'getProducts' },
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
                    console.log(resp);
                    commit('SET_REPAIRS', resp.data.repairs);
                    commit('setProducts', resp.data.products);
                    resolve(resp);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        STOP_REPAIR({ commit, getters }, repair) {
            console.log('STOP_REPAIR');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'stopRepair', value: repair },
                    { cmd: 'getRepairs' },
                    { cmd: 'getProducts' },
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
                    console.log(resp);
                    commit('SET_REPAIRS', resp.data.repairs);
                    commit('setProducts', resp.data.products);
                    resolve(resp);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
    }
}