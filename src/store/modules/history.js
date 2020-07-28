import axios from 'axios';
import { has } from 'lodash';

export default {
    state: {
        history: {},
    },
    getters: {
        history(state) {
            return state.history;
        }
    },
    mutations: {
        history(state, history) {
            state.history = history;
        },

        unsetHistory(state) {
            state.history = {};
        },

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
        saveToStateHistorySlice({ commit }, slice) {
            console.time("hist")
            const format = (slice) => {
                const history = {};

                for (let i of slice) {
                    if (has(history, i.order_id)) {
                        const order = history[i.order_id];
                        order.addSubOrder(i);
                    } else {
                        const order = new Order(i);
                        order.addSubOrder(i);
                        
                        history[i.order_id] = order;
                    }
                }

                return history;
            };
            commit('history', format(slice));
            console.timeEnd("hist")
        },
    }
}

function Order(order) {
    this.orderId = order.order_id;
    this.startTime = order.start_time;
    this.customerId = order.customer_id;
    this.subOrders = [];
}
Order.prototype.addSubOrder = function (subOrder) {
    this.subOrders.push(subOrder);
};

Order.prototype.getBill = function () {
    const bill = this.subOrders.reduce((acc, item) => {
        acc += +item.bill_rent;
        return acc;
    }, 0);

    return bill;
};
