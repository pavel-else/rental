export default {
    state: {
        customers: []
    },
    getters: {
        customers(state) {
            return state.customers
        },
        customerById(state) {
            return customer_id => {
                return state.customers.find(i => i.id_rent === customer_id);
            };
        },
    },
    mutations: {
        customers(state, customers) {
            console.log('commit: customers');

            state.customers = customers;
        }
    },
}