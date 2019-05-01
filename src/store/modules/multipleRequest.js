import axios from 'axios';
export default {
    state: {
        initCmds: []
    },
    actions: {
        multipleRequest({ commit, getters }, queue) {
            if (!queue || !queue.map) {
                console.warn('multipleRequest error! Queue is not defined or is not array!', queue);
            }

            const setToState = (data) => {
                for (let i in data) {
                    switch (i) {
                        case 'active_orders'     : commit('activeOrders'   , data[i]); break;
                        case 'orders'            : commit('orders'         , data[i]); break;
                        case 'active_sub_orders' : commit('activeSubOrders', data[i]); break;
                        case 'sub_orders'        : commit('subOrders'      , data[i]); break;
                        case 'products'          : commit('products'       , data[i]); break;
                        case 'tariffs'           : commit('tariffs'        , data[i]); break;
                        case 'customers'         : commit('customers'      , data[i]); break;
                        case 'accessories'       : commit('accessories'    , data[i]); break;
                        case 'general_settings'  : commit('generalSettings', data[i]); break;
                        case 'rental_point_info' : commit('rentalPointInfo', data[i]); break;
                        case 'categories'        : commit('categories'     , data[i]); break;
                        case 'repairs'           : commit('repairs'        , data[i]); break;
                        case 'repair_types'      : commit('repairTypes'    , data[i]); break;

                        case 'logs' : break;

                        default : console.warn('multipleRequest: Unknown type data - ', i);
                    }

                }
            };

            console.log('dispatch: multipleRequest', queue);

            return new Promise((resolve, reject) => {
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
                    console.log(resp);
                    setToState(resp.data);
                    resolve(true);                        
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                });
            });            
        },
        }
    }