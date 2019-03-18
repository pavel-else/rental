import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import options         from './opt'
import categories      from './categories'
import history         from './History/history'
import auth            from './auth-module'
import initApp           from './init-app-module'

import RentalPointInfo from './modules/rentalPointInfo';
import Repairs          from './modules/repairs';
import GeneralSettings from './modules/generalSettings';
import Accessories     from './modules/accessories';
import Tariffs         from './modules/tariffs';
import Products        from './modules/products';
import subOrders       from './modules/subOrders';
import orders          from './modules/orders';
import customers       from './modules/customers';



Vue.use(Vuex)

const store = new Vuex.Store({
    // strict: true,
    modules: {
        subOrders,
        customers,
        orders,
        options,
        categories,
        history,
        auth,
        initApp,
        RentalPointInfo,
        Repairs,
        GeneralSettings,
        Accessories,
        Tariffs,
        Products,
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

                    commit('products',      r.data.products)
                    commit('setHistory',       r.data.history)
                    commit('setOptions',       r.data.options)
                    commit('tariffs',       r.data.tariffs)
                    commit('setCategories',    r.data.categories)
                    commit('customers',     r.data.customers)
                    commit('subOrders',     r.data.sub_orders)
                    commit('orders',        r.data.orders)
                    commit('accessories',   r.data.accessories)
                    commit('generalSettings',   r.data.general_settings)
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
                    'getRentalPointInfo',
                    'getGeneralSettings',
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