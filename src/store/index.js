import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products   from './products'
import customers  from './Customers/customers'
import orders     from './orders'
import options    from './opt'
import tariffs    from './tariffs'
import categories from './categories'
import history    from './History/history'
<<<<<<< HEAD
import queue      from './queue'
=======
>>>>>>> f94785cad96dd914860b8c97e45846c63b64fbb8

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        customers,
        orders,
        options,
        tariffs,
        categories,
        history,
        queue
    },
<<<<<<< HEAD
    state: {
        queue: [],

        sendToServer(cmds, data, {commit}) {
            const url = options.state.url

            axios({
                method: 'post',
                url,
                data: {
                    cmds,
                    value: data
=======

    actions: {
        send({commit, dispatch}, cmds /*Array*/) {

            const check = (cmds) => {
                if (!cmds) {
                    return false
>>>>>>> f94785cad96dd914860b8c97e45846c63b64fbb8
                }

                if (cmds.cmd) {
                    return [{cmd: cmds.cmd, value: cmds.value}]
                }

                return cmds
            }

            const sendToServer = (queue) => {
                const send = new Promise((resolve, rejeect) => {

                    const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

                    console.log('request = ', queue)

                    axios({
                        method: 'post',
                        url,
                        data: {
                            queue
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
                    .then(r => {
                        console.log('response = ', r)  

                        commit('setProducts',   r.data.products)
                        commit('setHistory',    r.data.history)
                        commit('setOptions',    r.data.options)
                        commit('setTariffs',    r.data.tariffs)
                        commit('setCategories', r.data.categories)
                        commit('setCustomers',  r.data.clients) // Change to customer!
                        commit('setOrders', {orders: r.data.orders, products: r.data.products}) // split!
                    })

                    resolve()
                })
                send.then()

            }

            const set = (cmds) => {
                return  new Promise ((resolve, rejeect) => {
                    sendToServer(cmds)

                    resolve()               
                })
            }

            const upd = () => {
                cmds = [
                    'getProducts',
                    'getOrders', 
                    'getClients', 
                    'getHistory', 
                    'getTariffs', 
                    'getCategories', 
                    'getOptions', 
                    'getLogs'
                ]

                const queue = cmds.map(i => {
                    return {cmd: i}
                })
<<<<<<< HEAD
               
            })
        },

        send2Server({commit}) {
            const url = options.state.url
            const data = this.queue

            axios({
                method: 'post',
                url,
                data: {

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
                    commit('setTariffs', r.data.tariffs)
                    commit('setCategories', r.data.categories)
                })
               
            })
        },
    },
    
    actions: {
        upd({commit}, cmds) {           
            this.state.sendToServer(cmds, null, {commit})
        },

        // Из компонентов обращаться так: this.$store.dispatch('send', 'setCustomer', {a: 'a'})
        send({commit}, {cmd, value}) {
            this.state.sendToServer(cmd, value, {commit})
            console.log('send:', 'cmd = ' + cmd, 'value = ', value)
=======

                sendToServer(queue)
            }

            cmds ? set(check(cmds)).then(upd()) : upd()
        },

        upd({dispatch}) { 
            dispatch('send')        
>>>>>>> f94785cad96dd914860b8c97e45846c63b64fbb8
        },

        toQueque({commit}, {cmd, value}) {
            this.state.queue.push([cmd, value])
        },

        sendQueue({commit}) {
            this.state.send2Server({commit})
        }
    }
})

export default store