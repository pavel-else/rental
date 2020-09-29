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
        coordinates: null,
    },
    getters: {
        rentalPointInfo(state) {
            return state;
        }
    },
    mutations: {
        rentalPointInfo(state, rentalPointInfo) {
            for (let i in rentalPointInfo) {
                state[i] = rentalPointInfo[i];
            }
        },
        unsetRentalPointInfo(state) {
            state.name = null;
            state.address = null;
            state.open = null;
            state.close = null;
            state.phone = null;
            state.description = null;
            state.coordinates = null;
        },
    },
    actions: {
        getRentalPointInfo({ commit, getters }) {
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
                    // TODO: wtf?
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