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
                    return
                }

                if (cmds.cmd) {
                    return [{cmd: cmds.cmd, value: cmds.value}]
                }

                return cmds
            }

            const sendToServer = (queue) => {
                return new Promise((resolve, reject) => {

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
            }

            const makeUpd = () => {
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

                return queue
            }

            const set = (cmds) => {
                cmds = cmds ? cmds : []

                cmds = [...cmds, ...makeUpd()]

                sendToServer(cmds)
            }


            set(check(cmds))
        },

        upd({dispatch}) { 
            dispatch('send')        
        },


    }
})

export default store