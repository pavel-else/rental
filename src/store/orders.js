export default {
	state: {
		orders: []
	},
	mutations: {
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
                    const product = products.find(p => p.id_rent == order.products[i].product_id)

                    order.products[i].name = product ? product.name : ''
                }

                return order
            }) : []

            state.orders = result
            
        	console.log('set Orders')
        },
	},

    actions: {
        setOrders({commit}, {order, product}) {           
            commit('setOrders', {order, product})
        },
    },

	getters: {
        orders(state) {
            return state.orders
        },
	}
}