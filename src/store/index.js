import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products from './products'
import customers from './customers'
import orders from './orders'
import newOrder from './newOrder'
import stopOrder from './stopOrder'
import options from './opt'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        customers,
        orders,
        newOrder,
        stopOrder,
        options
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
                    // Нужно организовать автоматический перебор приходящего массива
                    commit('setProducts', r.data.products)
                    commit('setCustomers', r.data.clients)
                    commit('setOpt', r.data.options)
                    commit('setOrders', {orders: r.data.orders, products: r.data.products})
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