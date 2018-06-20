export default {
    state: {
        showNewOrder: false,
        newOrder: {
            order: {},
            product: {}
        },       
    },
    mutations: {
        showNewOrder(state, item) {
            state.showNewOrder = item
        },
        newOrder(state, product) {
            state.newOrder.product = product

            state.newOrder.order = {
                status: 'ACTIVE',
                products: [
                    product.id,
                ],
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
    },
    actions: {
        showNewOrder({commit}, item) {
            commit('showNewOrder', item)
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
    },
    getters: {
        showNewOrder(state) {
            return state.showNewOrder
        },

        newOrder(state) {
            return state.newOrder
        }
    }
}