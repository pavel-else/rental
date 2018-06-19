import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import products from './products'
import customers from './customers'
import orders from './orders'
import newOrder from './newOrder'
import options from './opt'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        products,
        customers,
        orders,
        newOrder,
        options
    },
    state: {        

        newOrder: {
            order: {},
            product: {}
        },

        showNewOrder: false,

        sendToServer(cmds, value, callback) {
            const url = this.url
            axios({
                method: 'post',
                url,
                data: {
                    cmds,
                    value
                }
            })
            .catch(e => {
                console.log(e)
            })
            .then(callback)      
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

    getters: {
        showNewOrder(state) {
            return state.showNewOrder
        },

        newOrder(state) {
            return state.newOrder
        }
    },

    mutations: {
        test(state, value) {
            console.log(value)
        },
        set(state, {type, items}) {
            console.log('set ' + type)
            state[type] = items
        },



        newOrder(state, product) {
            state.newOrder.product = product

            state.newOrder.order = {
                status: 'ACTIVE',
                products: [product.id],
                order_id_position: null,
                start_time: Math.floor(Date.now() / 1000),

                id_rental_org: "8800000001",
                accessories: '',
                advance: 0, //Сумма предоплаты
                advance_hold: false,
                advance_time: 0,
                bill: 0,
                bill_no_sale: null,
                customer_id: Number,
                customer_name: '',
                end_time: '',
                id: Number,
                note: '',
                order_id: Number,
                play_pause: true,
                sale_id: '',
            }
        },
        selectClient(state, customer) {
            state.newOrder.order.customer_id = customer.id

            let fname = customer.fname ? customer.fname : ''
            let sname = customer.sname ? ' ' + customer.sname : ''
            let tname = customer.tname ? ' ' + customer.tname : ''

            let name = (fname + sname + tname).trim()

            state.newOrder.order.customer_name = name
        },
        selectOrderId(state, item) {
            state.newOrder.order.order_id_position = item.position
            state.newOrder.order.order_id = item.order_id
        },
        showNewOrder(state, item) {
            state.showNewOrder = item
        },
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

        newOrder({commit}, product) {
            commit('newOrder', product)
        },

        selectClient({commit}, customer) {
            commit('selectClient', customer)
        },
        selectOrderId({commit}, id) {
            commit('selectOrderId', id)
        },
        showNewOrder({commit}, item) {
            commit('showNewOrder', item)
        },

        stopOrder({commit}, order) {
            order.end_time = Math.floor(Date.now() / 1000)

            let time_diff_timestamp = order.end_time * 1000 - Date.parse(order.start_time)
            let time_diff_h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

            const bill = Math.round(time_diff_h * 80) // * order.tarif 



            console.log(bill)


            const update = (r) => {
                console.log(r)

                const cmds = ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs']

                this.state.sendToServer(cmds, null, r => {
                    commit('set', {type: 'products', items: r.data.products})
                    commit('set', {type: 'customers', items: r.data.clients})
                    commit('set', {type: 'options', items: r.data.options})
                    commit('setOrders', {orders: r.data.orders, products: r.data.products})
                })                
            }     

            order.bill = bill

            console.log(order)

            this.state.sendToServer('stopOrder', order, update)
        }
    }
})

export default store