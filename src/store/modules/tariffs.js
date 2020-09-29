import axios from 'axios';
export default {
    state: {
        tariffs: []    
    },
    getters: {
        tariffs(state) {
            return state.tariffs;
        }
    },
    mutations: {
        tariffs(state, tariffs) {
            state.tariffs = tariffs;
        }
    },
    actions: {
        getTariffs({ commit, getters }) {
            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getTariffs' }
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
                    commit('tariffs', resp.data.tariffs);
                    resolve(true);
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        setTariff({ commit, getters }, tariff) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'setTariff', value: tariff },
                            { cmd: 'getTariffs'}
                        ],
                        token: localStorage.getItem('user-token')
                    },
                })
                .then(r => {
                    commit('tariffs', r.data.tariffs);
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        deleteTariff({ commit, getters }, id_rent) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'deleteTariff', value: id_rent },
                            { cmd: 'getTariffs'}
                        ],
                        token: localStorage.getItem('user-token')
                    },
                })
                .then(r => {
                    commit('tariffs', r.data.tariffs);
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        }
    }
}