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
        sendToServer(cmds, order, {commit}) {
            const url = options.state.url

            const callback = r => {
                console.log(r)
                commit('setProducts', r.data.products)
                commit('setCustomers', r.data.clients)
                commit('setOpt', r.data.options)
                commit('setOrders', {orders: r.data.orders, products: r.data.products})
            }

            axios({
                method: 'post',
                url,
                data: {
                    cmds,
                    value: order
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
                        value: order
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                .then(callback)
               
            })
        },

        timeFormat (ms/**number*/){
            if (ms < 0) ms = 0;

            function num(val){
                val = Math.floor(val);
                return val < 10 ? '0' + val : val;
            }
            
            var sec = ms / 1000
              , hours = sec / 3600  % 24
              , minutes = sec / 60 % 60
              , seconds = sec % 60
            ;

            return num(hours) + ":" + num(minutes) + ":" + num(seconds);
        },
    },
    mutations: {
    },

    actions: {
        upd({commit}, cmds) {           
            const url = options.state.url
            cmds = ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs']

            axios({
                method: 'post',
                url,
                data: {
                    cmds
                }
            })
            .catch(e => {
                console.log(e)
            })
            .then(r => {
                commit('setProducts', r.data.products)
                commit('setCustomers', r.data.clients)
                commit('setOpt', r.data.options)
                commit('setOrders', {orders: r.data.orders, products: r.data.products})
                console.log(r)
            })
        },

        send({commit}, {cmd, value}) {
            const url = options.state.url

            axios({
                method: 'post',
                url,
                data: {
                    cmds: cmd,
                    value
                }
            })
            .catch(e => {
                console.log(e)
            })
            .then(r => {
                const cmds = ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs']

                axios({
                    method: 'post',
                    url,
                    data: {
                        cmds
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                .then(r => {
                    commit('setProducts', r.data.products)
                    commit('setCustomers', r.data.clients)
                    commit('setOpt', r.data.options)
                    commit('setOrders', {orders: r.data.orders, products: r.data.products})
                    console.log(r)
                })
            })
        },

        stopOrder({commit}, order) {
            order.end_time = Math.floor(Date.now() / 1000)

            let time_diff_timestamp = order.end_time * 1000 - Date.parse(order.start_time)
            let time_diff_h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

            const bill = Math.round(time_diff_h * 80) // * order.tarif

            const update = (r) => {
                console.log('asdfasdfasdf')

                const cmds = ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs']

                this.state.sendToServer(cmds, null, r => {
                    commit('setProducts', r.data.products)
                    commit('setCustomers', r.data.clients)
                    commit('setOpt', r.data.options)
                    commit('setOrders', {orders: r.data.orders, products: r.data.products})
                    console.log(this._actions)
                })                
            }     

            order.bill = bill

            console.log(order)

            this.state.sendToServer('stopOrder', order, {commit})
        },
    }
})

export default store