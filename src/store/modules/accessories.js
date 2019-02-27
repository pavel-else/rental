import axios from 'axios';


export default {
    state: {
        accessories: []
    },
    getters: {
        accessories(state) {
            return state.accessories;
        }
    },
    mutations: {
        accessories(state, accessories) {
            console.log('commit: accessories');
            state.accessories = accessories;
        }
    },
    actions: {
        getAccessories({ commit, getters }) {
            console.log('dispatch: getAccessories');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getAccessories' }
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
                    commit('accessories', resp.data.accessories);
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