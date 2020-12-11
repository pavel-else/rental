import axios from 'axios';
export default {
  state: {
    tariffs: [],
  },
  getters: {
    tariffs(state) {
      return state.tariffs;
    }
  },
  mutations: {
    tariffs(state, tariffs) {
      state.tariffs = tariffs;
    }
  },
  actions: {
    async getTariffs({ commit }) {
      const response = await axios.get('/api/tariffs');

      if (response.data) {
        commit('tariffs', response.data);
      }
    },
    setTariff({ commit, getters }, tariff) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: getters.url,
          data: {
            queue: [
              { cmd: 'setTariff', value: tariff },
              { cmd: 'getTariffs'}
            ],
            token: localStorage.getItem('user-token')
          },
        })
        .then(r => {
          commit('tariffs', r.data.tariffs);
        })
        .catch(err => {
          console.log(err)
          reject(err);
        });
      });
    },
    deleteTariff({ commit, getters }, id_rent) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: getters.url,
          data: {
            queue: [
              { cmd: 'deleteTariff', value: id_rent },
              { cmd: 'getTariffs'}
            ],
            token: localStorage.getItem('user-token')
          },
        })
        .then(r => {
          commit('tariffs', r.data.tariffs);
        })
        .catch(err => {
          console.log(err)
          reject(err);
        });
      });
    }
  }
}