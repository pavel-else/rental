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
    },

    state: {
        queue: [],
    },

    mutations: {
        addToQueue(state, cell) {
            state.queue.push(cell)

            console.log('addToQueue', cell.cmd, cell)
        },
    },

    actions: {
        addToQueue({commit}, {cmd, value}) {
            if (!cmd) {
                console.log('empty cmd')
                return
            }

            commit('addToQueue', {cmd, value})
        },

        send({commit, dispatch}, cmds /*Array*/) {
            if (!cmds) {
                console.log('empty cmds')
                return
            }

            if (!cmds.map) {
                console.log('cmds is not array')
                return
            }

            cmds.map(i => {
                commit('addToQueue', {cmd: i.cmd, value: i.value})
            })

            dispatch('sendQueue')
            dispatch('upd')

        },

        sendQueue({state, commit}) {
            //const url = options.state.url
            const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

            console.log('request = ', state.queue)

            axios({
                method: 'post',
                url,
                data: {
                    queue: state.queue
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

            //clear queue
            state.queue = []
        },

        upd({dispatch, state}, cmds) { 
            const queue = new Promise((resolve, reject) => {
                [
                    'getProducts',
                    'getOrders', 
                    'getClients', 
                    'getHistory', 
                    'getTariffs', 
                    'getCategories', 
                    'getOptions', 
                    'getLogs'
                ].map(i => {
                    dispatch('addToQueue', {cmd: i})
                })
                
                resolve()
            })

            queue.then(dispatch('sendQueue'))         
        },
    }
})

export default store