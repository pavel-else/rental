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
        setGeneralSettings({ commit, getters }, settings) {
            console.log('dispatch: setGeneralSettings', settings);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: this.getters.url,
                    data: {
                        queue: [
                            { cmd: 'setGeneralSettings', value: settings },
                            { cmd: 'getGeneralSettings'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('generalSettings', r.data.general_settings);
                })
            })            
        }
    }
}