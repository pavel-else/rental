import Products from './products'
import Tariffs from './tariffs'

export default {
    components: {
        Products,
        Tariffs
    },
    state: {
        getBill() {
            // В компонентах вызывать так: const getBill = this.$store.getters.getBill()

            return function (order, product_id) {
                const product = Products.state.products.find(p => p.id_rent == product_id)
                const tariff = Tariffs.state.tariffs[product.tariff_id]

                const start = Date.parse(order.start_time)
                const end = order.end_time ? order.end_time : Math.floor(Date.now())

                const time_diff = end - start

                const h = (time_diff / 1000 / 60 / 60).toFixed(2) //округл до сотых


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

                    let result_formated = (result + bill_min) < max ? result + bill_min : max // return bill order in money
                    
                    return Math.floor(result_formated)
                }

                return getBill(h, tariff)
            } 

        },
    },
    getters: {
        getBill(state) {
            return state.getBill
        }
    }
}