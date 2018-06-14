import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
        orders: [],
        products: [],
        customers: [],
        options: {
            max_order_id: Number,
            new_order_id: Number,
        },

        newOrder: {
            order: {},
            product: {}
        },

        showNewOrder: false
    },

    getters: {
        url(state) {
            return state.url
        },
        showNewOrder(state) {
            return state.showNewOrder
        },
        products(state) {
            return state.products
        },
        orders(state) {
            return state.orders
        },
        customers(state) {
            return state.customers
        },
        options(state) {
            return state.options
        },

        newOrder(state) {
            return state.newOrder
        }

    },

    mutations: {
        set(state, {type, items}) {
            state[type] = items
        },

        setOrders(state, {orders, products}) {
            /*
            * Запись активных ордеров в хранилище
            * Функция подмешивает в массив данные (название продукта) из таблицы Продукты
            * Проверяем входные данные на наличие
            * Прогоняем массив Ордеров
            * Прогоняем массив продуктов каждого ордера
            * По id ордера продукта находим в таблице Продукты нужную запись
            * Сохраняем данные в массиве Ордеров
            */
            const result = orders ? orders.map(order => {
                for (var i = 0; i < order.products.length; i++) {
                    order.products[i].name = products.find(p => p.id == order.products[i].product_id).name
                }

                return order
            }) : []

            state.orders = result
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
        }

    },

    actions: {
        upd({commit}, cmds) {

            const url = this.state.url
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
                commit('set', {type: 'products', items: r.data.products})
                commit('set', {type: 'customers', items: r.data.clients})
                commit('set', {type: 'options', items: r.data.options})
                //commit('set', {type: 'orders', items: r.data.orders})
                commit('setOrders', {orders: r.data.orders, products: r.data.products})
                console.log(r)
            })
        },

        send({commit}, {cmd, value}) {
            const url = this.state.url

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
                    commit('set', {type: 'products', items: r.data.products})
                    commit('set', {type: 'customers', items: r.data.clients})
                    commit('set', {type: 'options', items: r.data.options})
                    //commit('set', {type: 'orders', items: r.data.orders})
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
        }
    }
})

export default store