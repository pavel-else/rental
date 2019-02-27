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
            return {
                name: state.name,
                id_rent: state.id_rent,
                city: state.city,
                address: state.address,
                time_open: state.time_open,
                time_close: state.time_close,
                phone: state.phone,
                description: state.description,
                description_short: state.description_short,
                coordinates: state.coordinates
            }
        }
    },
    mutations: {
        rentalPointInfo(state, rentalPointInfo) {
            console.log('set to state rentalPointInfo', rentalPointInfo);
            for (let i in rentalPointInfo) {
                state[i] = rentalPointInfo[i];
            }
        }
    },
    actions: {
        getRentalPointInfo({ commit, getters }) {
            console.log('getRentalPointInfo');

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
                    commit('rentalPointInfo', resp.data.rental_point_info[0]);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });
        },
        setRentalPointInfo({ commit, getters }, rentalPointInfo) {
            console.log('daspatch: setRentalPointInfo', rentalPointInfo);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: this.getters.url,
                    data: {
                        queue: [{ cmd: 'setRentalPointInfo', value: rentalPointInfo }],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('rentalPointInfo', rentalPointInfo);
                })
            });
        },
    }
}