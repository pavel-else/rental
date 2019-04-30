import axios from 'axios';

export default {
    state: {
        // logo,
        name: null,
        address: null,
        open: null,
        close: null,
        phone: null,
        description: null,
        coordinates: null
    },
    getters: {
        rentalPointInfo(state) {
            return state;
        }
    },
    mutations: {
        rentalPointInfo(state, rentalPointInfo) {
            console.log('commit: rentalPointInfo', rentalPointInfo);
            for (let i in rentalPointInfo) {
                state[i] = rentalPointInfo[i];
            }
        }
    },
    actions: {
        getRentalPointInfo({ commit, getters }) {
            console.log('dispatch: getRentalPointInfo');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getRentalPointInfo' },
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
                    commit('rentalPointInfo', resp.data.rental_point_info);
                    resolve(resp);                        
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        setRentalPointInfo({ commit, getters }, rentalPointInfo) {
            console.log('dispatch: setRentalPointInfo', rentalPointInfo);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [{ cmd: 'setRentalPointInfo', value: rentalPointInfo }],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('rentalPointInfo', rentalPointInfo);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
    }
}