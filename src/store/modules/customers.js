import axios from 'axios';
export default {
    state: {
        customers: []
    },
    getters: {
        customers(state) {
            return state.customers;
        },
        customerById(state) {
            return customer_id => {
                const customer = state.customers.find(i => i.id_rent === customer_id);
                return customer;
            };
        },
    },
    mutations: {
        customers(state, customers) {
            console.log('commit: customers', customers);

            state.customers = customers;
        }
    },
    actions: {
        getCustomers({ commit, getters }) {
            console.log('dispatch: getCustomers');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getCustomers' }
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

                    commit('customers', resp.data.customers);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });            
        },
        setCustomer({ commit, getters }, customer) {
            console.log('dispatch: setCustomer', customer);

            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: getters.url,
                    data: {
                        queue: [
                            { cmd: 'setCustomer', value: customer },
                            { cmd: 'getCustomers'},
                        ],
                        token: localStorage.getItem('user-token')
                    },                 
                })
                .then(r => {
                    console.log(r);
                    commit('customers', r.data.customers);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
            });
        },
    }
}