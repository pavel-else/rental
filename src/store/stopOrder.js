export default {
	actions: {
        stopOrder({commit}, order) {
            /*
            * Модуль расчитывает стоимость ордера и инициирует отправку на сервер
            *
            * 1. Опред. функции для нахождения id тарифа и просчета стоимости
            * 2. Определяем тариф
            * 3. Фиксируем стопордер, высчитываем общее время проката
            * 4. Просчитываем стоимость с помощью фукции
            * 5. Инициируем отправку ордера с обновленными данными
            */
            const stopOrder = (order) => {
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

                const tariffs = this.getters.tariffs
                const products = this.getters.products


                const tariff_id = gettTariffId(order.product_id, products)
                const tariff = tariffs[tariff_id]
                
                order.end_time = Math.floor(Date.now() / 1000)

                const time_diff_timestamp = order.end_time * 1000 - Date.parse(order.start_time)
                const time_diff_h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

                const bill = Math.round(getBill(time_diff_h, tariff))

                order.bill = bill

                console.log(order)
                this.state.sendToServer('stopOrder', order, {commit})
            }

            stopOrder(order)
        },
	}
}