export default {
	state: {
		orders: []
	},
	mutations: {
            /*
            * Запись активных ордеров в хранилище
            * Функция подмешивает в массив данные (название продукта) из таблицы Продукты
            * Проверяем входные данные на наличие
            * Прогоняем массив Ордеров
            * Прогоняем массив продуктов каждого ордера
            * По id ордера продукта находим в таблице Продукты нужную запись
            * Сохраняем данные в массиве Ордеров
            */
        // setOrders(state, {orders, products}) {

        //     const result = orders ? orders.map(order => {
        //         for (var i = 0; i < order.products.length; i++) {
        //             const product = products.find(p => p.id_rent == order.products[i].product_id)

        //             order.products[i].name = product ? product.name : ''
        //         }

        //         return order
        //     }) : []

        //     state.orders = result
            
        //     console.log('set Orders')
        // },

        setOrders(state, orders) {

            state.orders = orders
            
        	console.log('set Orders')
        },
	},



    actions: {
        // setOrders({commit}, {order, product}) {           
        //     commit('setOrders', {order, product})
        // },

        setOrders({commit}, orders) {           
            commit('setOrders', orders)
        },
    },


	getters: {
        orders(state) {
            return state.orders
        },
	}
}