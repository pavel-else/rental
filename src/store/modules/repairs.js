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
        },
        unsetRepairs(state) {
            console.log('commit: unsetRepairs');
            state.repairs = [];
        },
        unsetRepairTypes(state) {
            console.log('commit: unsetRepairTypes');
            state.repairTypes = [];
        },
    },
    actions: {
        getRepairs({ commit, getters }) {
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
        setRepair({ commit, getters }, repair) {
            console.log('dispatch: setRepair');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'setRepair', value: repair },
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
                    console.log(resp);
                    commit('repairs', resp.data.repairs);
                    commit('repairTypes', resp.data.repair_types);
                    commit('products', resp.data.products);
                    resolve(resp);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        stopRepair({ commit, getters }, repair) {
            console.log('dispatch: stopRepair');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'stopRepair', value: repair },
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
                    console.log(resp);
                    commit('repairs', resp.data.repairs);
                    commit('repairTypes', resp.data.repair_types);
                    commit('products', resp.data.products);
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