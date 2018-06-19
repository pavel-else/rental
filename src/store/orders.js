export default {
	state: {
		orders: []
	},
	mutations: {
        setOrders(state, {orders, products}) {
        	console.log('set Orders')
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
	},
	getters: {
        orders(state) {
            return state.orders
        },
	}
}