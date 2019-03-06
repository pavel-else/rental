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
        setAccessory({ commit, getters }, accessory) {
            console.log('dispatch: setAccessory', accessory);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'setAccessory', value: accessory },
                            { cmd: 'getAccessories'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('accessories', r.data.accessories);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
        deleteAccessory({ commit, getters }, id_rent) {
            console.log('dispatch: deleteAccessory', id_rent);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'deleteAccessory', value: id_rent },
                            { cmd: 'getAccessories'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('accessories', r.data.accessories);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }
}