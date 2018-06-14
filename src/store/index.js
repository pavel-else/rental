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
        },

        newOrder: {
            order: {},
            product: {}
        }
    },

    getters: {
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
            * Прогоняем массив Ордеров
            * Прогоняем массив продуктов каждого ордера
            * По id ордера продукта находим в таблице Продукты нужную запись
            * Сохраняем данные в массиве Ордеров
            */
            const result = orders.map(order => {
                for (var i = 0; i < order.products.length; i++) {
                    order.products[i].name = products.find(p => p.id == order.products[i].product_id).name
                }

                return order
            })

            state.orders = result
        },

        newOrder(state, product) {
            state.newOrder.product = product

            state.newOrder.order = {
                status: 'ACTIVE',
                products: [product.id],
                order_id_position: null,

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
                start_time: String,
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
        }

    },

    actions: {
        upd({commit}, cmds) {
            const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

            axios({
                method: 'post',
                url,
                data: {
                    cmds
                }
            })
            .then(r => {
                commit('set', {type: 'products', items: r.data.products})
                commit('set', {type: 'customers', items: r.data.clients})
                commit('set', {type: 'options', items: r.data.options})
                //commit('set', {type: 'orders', items: r.data.orders})
                commit('setOrders', {orders: r.data.orders, products: r.data.products})
                console.log(r)
            })
            .catch(e => {
                console.log(e)
            })
        },
        set({commit}, {cmd, data}) {

        },

        newOrder({commit}, product) {
            commit('newOrder', product)
        },

        selectClient({commit}, customer) {
            commit('selectClient', customer)
        },
        selectOrderId({commit}, id) {
            commit('selectOrderId', id)
        }
    }
})

export default store