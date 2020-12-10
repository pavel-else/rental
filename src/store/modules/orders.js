import axios from 'axios';
export default {
  state: {
    orders: [],
    activeOrders: [],
  },
  getters: {
    orders(state) {
      return state.orders;
    },
    activeOrders(state) {
      return state.activeOrders;
    }
  },
  mutations: {
    orders(state, orders) {
      state.orders = orders;
    },
    activeOrders(state, activeOrders) {
      state.activeOrders = activeOrders;
    },
    unsetOrders(state) {
      state.orders = [];
    },
    unsetActiveOrders(state) {
      state.activeOrders = [];
    },
  },
  actions: {
    async getOrders({ commit }) {
      const response = await axios.get('/api/orders');

      if (response.data) {
        commit('orders', response.data);
      }
    },

    changeOrder({ commit, getters }, order) {
      return new Promise((resolve, reject) => {
        const queue = [
          { cmd: 'changeOrder', value: order },
          { cmd: 'getOrders' }
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
          commit('orders', resp.data.orders);
          resolve(true);
        }).
        catch(err => {
          console.log(err)
          reject(err);
        })
      }); 
    },
  },
}