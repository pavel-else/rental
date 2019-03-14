export default {  
    state: {
        products: []
    },
    mutations: {
        setProducts(state, products) {
            state.products = products;
            console.log('set products');
        }
    },
    actions: {
        setProducts({commit}, products) {
            commit('setProducts', products);
        }
    },
    getters: {
        products: state => state.products,
        productName: state => product_id => {
            const product = state.products.find(i => i.id_rent === product_id);
            return product ? product.name : '';
        };
    }
}


