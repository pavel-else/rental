import axios from 'axios';

export default {
    state: {
        categories: [],
        activeCategory: false,
    },
    getters: {
        categories(state) {
            return state.categories;
        },
        activeCategory(state) {
            // Активной считается выбранная или, если нет такой, первая в списке
            return state.activeCategory ? state.activeCategory : state.categories ? state.categories[0] : false;
        }
    },
    mutations: {
        categories(state, categories) {
            console.log('commit: categories', categories);

            state.categories = categories;
        },
        activeCategory(state, category) {
            console.log('commit: activeCategory', category);

            state.activeCategory = category;
        },
        unsetCategories(state) {
            console.log('commit: unsetCategories');
            state.categories = [];
        },
        unsetActiveCategories(state) {
            console.log('commit: unsetActiveCategories');
            state.activeCategories = false;
        },

    },
    actions: {
        getCategories({ commit, getters }) {
            console.log('dispatch: getCategories');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getCategories' }
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

                    commit('categories', resp.data.categories);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });            
        },
        // setCustomer({ commit, getters }, customer) {
        //     console.log('dispatch: setCustomer', customer);

        //     return new Promise((resolve, reject) => {
        //         axios({
        //             method: 'post',
        //             url: getters.url,
        //             data: {
        //                 queue: [
        //                     { cmd: 'setCustomer', value: customer },
        //                     { cmd: 'getCustomers'},
        //                 ],
        //                 token: localStorage.getItem('user-token')
        //             },                 
        //         })
        //         .then(r => {
        //             console.log(r);
        //             commit('customers', r.data.customers);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             reject(err);
        //         });
        //     });
        // },
    }
}