import axios from 'axios';
export default {
  state: {
    subOrders: [],
    activeSubOrders: []
  },
  getters: {
    subOrders(state) {
      return state.subOrders;
    },
    activeSubOrders(state) {
      return state.activeSubOrders;
    },
  },
  mutations: {
    subOrders(state, subOrders) {
      state.subOrders = subOrders;
    },
    activeSubOrders(state, activeSubOrders) {
      state.activeSubOrders = activeSubOrders;
    },
    unsetActiveSubOrders(state) {
      state.activeSubOrders = [];
    },
    unsetSubOrders(state) {
      state.subOrders = [];
    },
  },
  actions: {
    async getSubOrders({ commit }) {
      const response = await axios.get('/api/sub-orders');

      if (response.data) {
        commit('subOrders', response.data);
      }
    },
    changeSubOrders({ getters }, subOrders) {
      return new Promise((resolve, reject) => {
        const queue = subOrders.map(i => {
          return { cmd: 'changeSubOrder', value: i };
        });
        
        // queue.push({ cmd: 'getSubOrders'});

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
        .then(() => {
          // commit('subOrders', resp.data.sub_orders);
          resolve(true);
        }).
        catch(err => {
          console.log(err)
          reject(err);
        })
      }); 
    },
    changeSubOrder({ getters }, subOrder) {
      return new Promise((resolve, reject) => {
        const queue = [
          { cmd: 'changeSubOrder', value: subOrder },
          // { cmd: 'getSubOrders'}
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
        .then(() => {
          resolve(true);
        }).
        catch(err => {
          console.log(err)
          reject(err);
        })
      }); 
    }
  },
}