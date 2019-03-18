export default {
    state: {
        customers: []
    },
    getters: {
        customers(state) {
            return state.customers
        },
        customerNameById(state) {
            return customer_id => {
                const customer = state.customers.find(i => i.id_rent === customer_id);
                return customer ? customer.name : '';
            };
        }
    },
    mutations: {
        customers(state, customers) {
            console.log('commit: customers');

            state.customers = customers;
        }
    },
}