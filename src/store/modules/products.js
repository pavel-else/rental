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
    async getProducts({ commit }) {
      const response = await axios.get('/api/products');
      
      if (response.data) {
        commit('products', response.data);
      }
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