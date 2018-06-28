export default {
    actions: {
        stopOrderAll({commit}, {order_id, products_id}) {
            const gettTariffId = (product_id, products) => {
                const product = products.find(p => p.id_rent == product_id)

                return product.tariff_id ? product.tariff_id : null
            }
            
            const getBill = (h, tariff) => {
                const min = 0.5
                const min$ = 60
                const max = 500


                let result = 0

                if (h <= min) {
                    return min$
                }

                if (h < 1) {
                    return h * tariff[1]
                }

                for (let i = 1; i <= h; i++) {
                    result += tariff[i]
                    if (result >= max) {
                        return max
                    }
                }
                
                const i = (h - Math.floor(h)).toFixed(2)
                const bill_min = i * tariff[Math.ceil(h)]

                return (result + bill_min) < max ? result + bill_min : max // return bill order in money
            }

            const orders = this.getters.orders
            const order = orders.find(o => o.order_id == order_id)

            const activeProducts = order.products.filter(p => p.end_time === null)

            activeProducts.map(product => {
                product.start_time = order.start_time
                product.end_time = Math.floor(Date.now() / 1000)

                const tariffID = gettTariffId(product.product_id, this.getters.products)
                const tariff = this.getters.tariffs[tariffID]

                const time_diff_timestamp = product.end_time * 1000 - Date.parse(product.start_time)
                const time_diff_h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

                product.bill = Math.round(getBill(time_diff_h, tariff))

                //console.log(product)

                this.state.sendToServer('stopOrder', product, {commit})
            })
        }


    }
}