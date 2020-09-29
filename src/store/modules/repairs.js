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
            state.repairs = repairs;
        },
        repairTypes(state, repairTypes) {
            state.repairTypes = repairTypes;
        },
        unsetRepairs(state) {
            state.repairs = [];
        },
        unsetRepairTypes(state) {
            state.repairTypes = [];
        },
    },
    actions: {
        getRepairs({ commit, getters }) {
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
        setRepairType({ commit, getters }, repairType) {
            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'setRepairType', value: repairType },
                    { cmd: 'getRepairTypes' },
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
                    commit('repairTypes', resp.data.repair_types);
                    resolve(resp);
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        deleteRepairType({ commit, getters }, repairTypeId) {
            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'deleteRepairType', value: repairTypeId },
                    { cmd: 'getRepairTypes' },
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
                    commit('repairTypes', resp.data.repair_types);
                    resolve(resp);
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
    }
};