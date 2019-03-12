import axios from 'axios';

export default {
    state: {
        rent_min_time:     0, //min
        rent_round_bill:   0,

        lastOrderID:       null,
        lastOrderTime:     null,
        lastOrderInterval: 180000, //ms 

        registration_time: 0
    },
    getters: {
        generalSettings(state) {
            return {
                rent_min_time: state.rent_min_time,
                rent_round_bill: state.rent_round_bill,
                lastOrderID: state.lastOrderID,
                lastOrderTime: state.lastOrderTime,
                lastOrderInterval: state.lastOrderInterval,
                registration_time: state.registration_time
            }
        }
    },
    mutations: {
        generalSettings(state, settings) {
            console.log('commit: generalSettings', settings);
            for (let i in settings) {
                state[i] = settings[i];
            }
        }
    },
    actions: {
        getGeneralSettings({ commit, getters }) {
            console.log('getGeneralSettings');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getGeneralSettings' }
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
                    const settings = resp.data.general_settings.reduce((acc, item) => {
                        acc[item.name] = item.value;
                        return acc;
                    }, []);
                    commit('generalSettings', settings);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });            
        },
        setGeneralSettings({ commit, getters }, settings) {
            console.log('dispatch: setGeneralSettings', settings);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
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
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }
}