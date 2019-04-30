import axios from 'axios';
export default {  
    state: {
        products: []
    },
    getters: {
        products(state) {
            return state.products;
        },
        // productNameById(state) {
        //     return product_id => {
        //         const product = state.products.find(i => i.id_rent === product_id);
        //         return product ? product.name : '';
        //     };
        // }
    },
    mutations: {
        products(state, products) {
            console.log('commit: products', products);
            state.products = products;
        }
    },
    actions: {
        getProducts({ commit, getters }) {
            console.log('dispatch: getProducts');

            return new Promise((resolve, reject) => {
                const queue = [
                        { cmd: 'getProducts'},
                        { cmd: 'getTariffs'},
                        { cmd: 'getRentalPointInfo'}
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
                .then(r => {
                    console.log(r);
                    commit('rentalPointInfo', r.data.rental_point_info);
                    commit('tariffs', r.data.tariffs);
                    commit('products', r.data.products);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                })
            });            
        },
        setProduct({ commit, getters }, product) {
            console.log('dispatch: setProduct', product);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'setProduct', value: product },
                            { cmd: 'getProducts'},
                            { cmd: 'getTariffs'},
                            { cmd: 'getRentalPointInfo'}
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('rentalPointInfo', r.data.rental_point_info);
                    commit('tariffs', r.data.tariffs);
                    commit('products', r.data.products);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
        deleteProduct({ commit, getters }, id_rent) {
            console.log('dispatch: deleteProduct', id_rent);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'deleteProduct', value: id_rent },
                            { cmd: 'getProducts'},
                            { cmd: 'getTariffs'},
                            { cmd: 'getRentalPointInfo'},
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('rentalPointInfo', r.data.rental_point_info);
                    commit('tariffs', r.data.tariffs);
                    commit('products', r.data.products);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }
}