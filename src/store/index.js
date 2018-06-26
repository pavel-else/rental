import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products from './products'
import customers from './customers'
import orders from './orders'
import newOrder from './newOrder'
import stopOrder from './stopOrder'
import stopOrderAll from './stopOrderAll'
import options from './opt'
import tariffs from './tariffs'
import history from './history'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        customers,
        orders,
        newOrder,
        stopOrder,
        stopOrderAll,
        options,
        tariffs,
        history
    },
    state: {
        sendToServer(cmds, data, {commit}) {
            const url = options.state.url

            axios({
                method: 'post',
                url,
                data: {
                    cmds,
                    value: data
                }
            })
            .catch(e => {
                console.log(e)
            })
            .then(r => {
                console.log(r)

                axios({
                    method: 'post',
                    url,
                    data: {
                        cmds: options.state.cmds,
                        value: data
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                .then(r => {
                    console.log(r)
                    // Нужно организовать автоматический перебор приходящего массива
                    commit('setProducts', r.data.products)
                    commit('setCustomers', r.data.clients)
                    commit('setOpt', r.data.options)
                    commit('setOrders', {orders: r.data.orders, products: r.data.products})
                    commit('setHistory', r.data.history)
                })
               
            })
        },
    },
    mutations: {
    },

    actions: {
        upd({commit}, cmds) {           
            this.state.sendToServer(cmds, null, {commit})
        },

        send({commit}, {cmd, value}) {
            this.state.sendToServer(cmd, value, {commit})
        },
    }
})

export default store