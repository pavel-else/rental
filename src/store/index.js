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


    actions: {
        send({commit, dispatch}, cmds /*Array*/) {

            const check = (cmds) => {
                if (!cmds) {

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
                sendToServer(queue)
            }

            cmds ? set(check(cmds)).then(upd()) : upd()
        },

        upd({dispatch}) { 
            dispatch('send')        
        },


    }
})

export default store