export default {
	state: {
		history: []
	},
	mutations: {
		setHistory(state, history) {
			if(!history) {
				return []
			}
			const products = this.getters.products
            const result = history ? history.map(order => {
            	let bill = 0

                for (var i = 0; i < order.products.length; i++) {
                    order.products[i].name = products.find(p => p.id_rent == order.products[i].product_id).name
                    
                    bill += +order.products[i].bill
                }

                order.bill = bill
                order.countProducts = order.products.length

                return order
            }) : []

			state.history = history

			console.log('set history')
		}
	},
	getters: {
		history(state) {
			return state.history
		}
	}
}