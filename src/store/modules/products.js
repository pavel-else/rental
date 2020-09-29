import axios from 'axios';
export default {  
    state: {
        products: [],
        newProducts: null,
    },
    getters: {
        products(state) {
            return state.products;
        },
        newProducts(state) {
            return state.newProducts;
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
            state.products = products;

            const prepare = (products) => {
                const result = {};

                for (const product of products) {
                    result[product.id_rent] = product;
                }

                return result;
            };

            state.newProducts = prepare(products);
        },
        unsetProducts(state) {
            state.products = [];
        },
    },
    actions: {
        getProducts({ commit, getters }) {
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