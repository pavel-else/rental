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
            return state;
        }
    },
    mutations: {
        generalSettings(state, _settings) {
            // По идее эта обработка должна быть в экшине, но т.к. эта мутация вызывается еще при обновлении при новом ордере (нарушая конвенцию), то она вынесена временно сюда
            const settings = _settings.reduce((acc, item) => {
                acc[item.name] = item.value;
                return acc;
            }, []);

            console.log('commit: generalSettings', settings);
            for (let i in settings) {
                state[i] = settings[i];
                console.log(i, state[i])
            }
        }
    },
    actions: {
        getGeneralSettings({ commit, getters }) {
            console.log('dispatch: getGeneralSettings');

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

                    commit('generalSettings', resp.data.general_settings);
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