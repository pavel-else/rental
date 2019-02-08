import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products        from './products'
import subOrders       from './subOrders'
import customers       from './Customers/customers'
import orders          from './orders'
import options         from './opt'
import tariffs         from './tariffs'
import categories      from './categories'
import history         from './History/history'
import accessories     from './accessories'
import auth            from './auth-module'
import initApp           from './init-app-module'
import RentalPointOptions from './Options/RentalPoint'



Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        subOrders,
        customers,
        orders,
        options,
        tariffs,
        categories,
        history,
        accessories,
        auth,
        initApp,
        RentalPointOptions
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
        send({commit}, cmds /*Array*/) {
            const config = cmds && cmds.config ? cmds.config : null

            const prepare = (cmds) => {
                if (!cmds) {
                    return
                }

                if (cmds.cmd) {
                    return [{ cmd: cmds.cmd, value: cmds.value }]
                }

                return cmds
            }

            const sendToServer = (queue) => {
                
                const url = this.getters.url

                console.log('front --> back', queue)

                axios({
                    method: 'post',
                    url,
                    data: {
                        queue,
                        token: localStorage.getItem('user-token')
                    },
                    config,                    
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
                    'getAccessories',
                    'getHeaders',
                    'getRentalPointInfo'
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

            set(prepare(cmds))
        },

        upload(formData) {
            const url = this.getters.activePath + 'user_uploads.php'
            console.log(url)
            
            const config = {
                header: {
                    'Content-Type' : 'multipart/form-data'
                }
            }
            
            axios.post(url, formData, config).then(
                r => {console.log(r)}
            )
        },

        upd({dispatch}) { 
            dispatch('send')        
        },
    }
})

export default store