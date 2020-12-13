import axios from 'axios';
import isValidDate from '@/functions/isValidDate';

export default {
  state: {
    customers: [],
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
    lastCustomer(state) {
      const lastCustomer = state.customers.reduce((acc, item) => {
        if (acc === null) {
          acc = item;
        }

        if (!isValidDate(new Date(item.created))) {
          console.warn('Date parse error! Customers.js, customer_id = ' + item.id_rent);
        }

        if (Date.parse(item.created) > Date.parse(acc.created)) {
          acc = item;
        }

        return acc;
        
      }, null);

      return lastCustomer;
    }
  },
  mutations: {
    customers(state, customers) {
      state.customers = customers;
    },
    unsetCustomers(state) {
      state.customers = [];
    },
  },
  actions: {
    async getCustomers({ commit }) {
      const response = await axios.get('/api/customers');

      if (response.data) {
        commit('customers', response.data);
      }
    },
    setCustomer({ commit, getters }, customer) {
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
          commit('customers', r.data.customers);
        })
        .catch(err => {
          reject(err);
        });
      });
    },
  }
}