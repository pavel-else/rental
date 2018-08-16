import copyObject from './copyObject'

export default {
	makeOrder(order, product) {

	   	const merge = (order_id, product) => {
	   		const find = this.copyObject(this.$store.getters.orders.find(i => i.order_id == order_id))

	   		if (find) {
	   			find.products.push(product)
	   			return find
	   		} else {
	   			order.products.push(product)
	   			return order
	   		}


	   			//order.products.push(product)

	   		return order
	   	}

   		return merge(order.order_id, product)
   	}
}