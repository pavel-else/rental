import getBill         from '../../../functions/getBill'
import getSale         from './getSale'
import activateProduct from './activateProduct'
import roundBill       from '../../../functions/roundBill'

export default {
    stopSubOrder(order, subOrder) {
        /*
        * Функция должна:
        * 1) Проставить Время остановки
        * 2) Проставить Стоимость проката
        * 3) Проставить Стоимость аксессуаров
        * 4) Просчитать и проставить Скидку
        * 5) Поставить Статус "Стоп"
        * 6) Менять статус товара на "Астивный"
        * 7) Если закрывается последний саб - закрывать ордер
        * 8) Передавать данные на отправку
        */

        let cmds = []

        // 1) Проставить Время остановкиа
        subOrder.end_time = Date.now()

        // 2) Проставить Стоимость проката
        const billRent = () => {
            const time = subOrder.end_time - Date.parse(order.start_time) - subOrder.pause_time
            return roundBill(getBill(subOrder.tariff_id, time))            
        }

        subOrder.bill_rent = billRent()

        // 3) Проставить Стоимость аксессуаров
        const billAccess = () => {

            const getAccess = () => {
                if (!subOrder.accessories) {
                    return null
                }

                console.log(subOrder.accessories)
                const split = subOrder.accessories.split(',') // [1, 2]

                return split.map(i => {
                    return this.$store.getters.accessories.find(j => j.id_rent == i)
                })
            }

            const accessories = getAccess()

            return accessories ? accessories.reduce((acc, item) => {
                acc += item.type == "%" 
                    ? this.subOrder.bill_rent * (item.value / 100)
                    : +item.value

                return acc
            }, 0) : 0
        }

        subOrder.bill_access = billAccess()

        // 4) Просчитать и проставить Скидку
        subOrder.sale = getSale(+subOrder.bill_rent + +subOrder.bill_access, order)

        // 5) Поставить Статус "Стоп"
        subOrder.status = "END"

        cmds.push({cmd: 'changeSubOrder', value: subOrder})


        // 6) Менять статус товара на "Астивный"
        const product = activateProduct(subOrder)

        cmds.push({cmd: 'setProduct', value: product})


        // 7) Если закрывается последний саб - закрывать ордер
        const activeSubOrders = this.$store.getters.subOrders.filter(i => {
            return i.order_id === subOrder.order_id && (i.status === "ACTIVE" || i.status === "PAUSE")
        })

        if (activeSubOrders.length === 1 && activeSubOrders.find(i => i.id_rent === subOrder.id_rent)) {
            order.status = "END"
            cmds.push({cmd: 'changeOrder', value: order})
        }


        // 8) Передавать данные на отправку
        this.$store.dispatch('send', cmds)
    }
}