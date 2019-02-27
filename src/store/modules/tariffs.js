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
            console.log('commit: set tariffs');
            state.tariffs = tariffs;
        }
    },
    actions: {
        getTariffs({ commit, getters }) {
            console.log('dispatch: getTariffs');

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
                    console.log(resp);
                    commit('tariffs', resp.data.tariffs);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });            
        },
        setTariff({ commit, getters }, tariff) {
            console.log('dispatch: setTariff', tariff);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: this.getters.url,
                    data: {
                        queue: [
                            { cmd: 'setTariff', value: tariff },
                            { cmd: 'getTariffs'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('tariffs', r.data.tariffs);
                })
            });
        },
        deleteTariff({ commit, getters }, id_rent) {
            console.log('dispatch: deleteTariff', id_rent);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: this.getters.url,
                    data: {
                        queue: [
                            { cmd: 'deleteTariff', value: id_rent },
                            { cmd: 'getTariffs'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('tariffs', r.data.tariffs);
                })
            });
        }
    }
}