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
import queue      from './queue'

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
            console.log('send:', 'cmd = ' + cmd, 'value = ' + value)
        },
    }
})

export default store