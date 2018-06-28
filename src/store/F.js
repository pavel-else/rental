import Products from './products'
import Tariffs from './tariffs'

export default {
    components: {
        Products,
        Tariffs
    },
    state: {
        getBill ({start, end, product_id, sale}) {
            end = end ? end : Math.floor(Date.now())

            const time_diff_timestamp = end - Date.parse(start)
            const h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

            const product = Products.state.products.find(p => p.id_rent == product_id)

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

            const tariff = Tariffs.state.tariffs[product.tariff_id]

            return getBill(h, tariff)
        }
    },
}