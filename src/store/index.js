import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products        from './products'
import orderProducts   from './orderProducts'
import customers       from './Customers/customers'
import orders          from './orders'
import options         from './opt'
import tariffs         from './tariffs'
import categories      from './categories'
import history         from './History/history'
import accessories     from './accessories'


Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        orderProducts,
        customers,
        orders,
        options,
        tariffs,
        categories,
        history,
        accessories,
    },

    actions: {
        /*
        * Функция предназначена для отправки данных на сервер и обработки ответа с сервера
        * Принимает массив объектов в формате [{cmd, value}, {cmd, value}]
        * Также может принимать и одиночные объекты {cmd, value}, функция обернет в массив автоматом
        * На сервер отправляется массив, содерж во-первых сеттеры, во-вторых геттеры для обновл. фронта
        * Сеттеров может и не быть, тогда отправляются только команды обновления
        * Внимание! Здесь все асинхронно!
        */
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
                const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

                console.log('front --> back', queue)

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
                    console.log('front <-- back', r)  

                    commit('setProducts',      r.data.products)
                    commit('setHistory',       r.data.history)
                    commit('setOptions',       r.data.options)
                    commit('setTariffs',       r.data.tariffs)
                    commit('setCategories',    r.data.categories)
                    commit('setCustomers',     r.data.customers)
                    commit('setSubOrders',     r.data.sub_orders)
                    commit('setOrders',        r.data.orders)
                    commit('setAccessories',   r.data.accessories)
                })
            }

            const makeUpd = () => {
                cmds = [
                    'getProducts',
                    'getSubOrders',
                    'getOrders', 
                    'getCustomers', 
                    'getHistory', 
                    'getTariffs', 
                    'getCategories', 
                    'getOptions', 
                    'getLogs',
                    'getAccessories'
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