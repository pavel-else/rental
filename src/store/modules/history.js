import axios from 'axios';

export default {
    state: {
        history: []
    },
    getters: {
        history(state) {
            return state.history
        }
    },
    mutations: {
        history(state, history) {
            console.log('commit: history', history);

            if(!history) {
                return []
            }
            const products = this.getters.products
            
            history ? history.map(order => {
                let bill = 0

                for (var i = 0; i < order.products.length; i++) {
                    const product = products.find(p => p.id_rent == order.products[i].product_id)

                    order.products[i].name = product ? product.name : ''
                    
                    bill += +order.products[i].bill
                }

                order.bill = bill

                return order
            }) : []

            state.history = history
        }
    },
    actions: {
        getHistory({ commit, getters }) {
            console.log('dispatch: getHistory');

            return new Promise((resolve, reject) => {
                const queue = [
                    { cmd: 'getHistory' }
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

                    commit('history', resp.data.history);
                    resolve(true);                        
                }).
                catch(err => {
                    console.log(err)
                    reject(err);
                });
            });            
        },
    }
}