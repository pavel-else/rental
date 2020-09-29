import axios from 'axios';
import { has } from 'lodash';

export default {
    state: {
        history: [],
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
            const format = (slice) => {
                // С сервера данные приходят упорядоченными по дате открытия (startDate)
                // Стоит задача  1. Сохранить этот порядок. 2. Сгруппировать сабордеры в общем ордере
                // Order: { orderId, ..., subOrders: [subOrder1, ...] }

                const historyArr = [];
                const historyObj = {};

                for (let i of slice) {
                    if (has(historyObj, i.order_id)) {
                        const order = historyObj[i.order_id];
                        order.addSubOrder(i);
                    } else {
                        const order = new Order(i);
                        order.addSubOrder(i);
                        
                        historyArr.push(order);
                        historyObj[i.order_id] = order;
                    }
                }

                return historyArr;
            };
            commit('history', format(slice));
        },
    }
}

function Order(order) {
    this.orderId      = order.order_id;
    this.status       = order.order_status;
    this.startTime    = order.start_time;
    this.customerId   = order.customer_id;
    this.subOrders    = [];
    this.depositId    = order.deposit;
    this.offBalance   = order.off_balance ? +order.off_balance : 0;
    this.advance      = order.advance ? +order.advance : 0;
    this.note         = order.note;
}

Order.prototype.addSubOrder = function (subOrder) {
    this.subOrders.push(subOrder);
};

Order.prototype.getBill = function () {
    const bill = this.subOrders.reduce((acc, item) => {
        acc += +item.bill_rent + +item.bill_access - +item.sale;
        return acc;
    }, 0);

    return bill;
};

Order.prototype.getEndTime = function () {
    // TODO: Нужно учесть, что могут приходить активные ордеры

    const end_time = this.subOrders.reduce((acc, item) => {
        if (!acc) {
            acc = item.end_time;
        }

        if (Date.parse(acc) < Date.parse(item.end_time)) {
            acc = item.end_time;
        }


        return acc;
    }, null);
    
    return end_time;
};

Order.prototype.getPlayTime = function () {
    const end_time = Date.parse(this.getEndTime());
    const start_time = Date.parse(this.startTime);

    if (isNaN(end_time) || isNaN(start_time)) {
        return 'Ошибка парсинга. order_id = ' + this.orderId;
    }

    return end_time - start_time;
};
