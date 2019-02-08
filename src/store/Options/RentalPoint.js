import axios from 'axios';

export default {
    state: {
        // logo,
        name: null,
        address: null,
        open: null,
        close: null,
        telephone: null,
        description: null,
        coordinates: null
    },
    getters: {
        rentalPointInfo(state) {
            return {
                name: state.name,
                city: state.city,
                address: state.address,
                time_open: state.time_open,
                time_close: state.time_close,
                phone: state.phone,
                description: state.description,
                coordinates: state.coordinates
            }
        }
    },
    mutations: {
        setRentalPointInfo(state, rentalPointInfo) {
            for (let i in rentalPointInfo) {
                state[i] = rentalPointInfo[i];
            }
        }
    },
    actions: {
        sendRentalPointOptions({ commit, dispatch, getters }, rentalPointInfo) {
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
                    dispatch('setRentalPointInfo', rentalPointInfo);
                })
            })
        },
        setRentalPointInfo({ commit }, rentalPointInfo) {
            commit('setRentalPointInfo', rentalPointInfo);
        }
    }
}