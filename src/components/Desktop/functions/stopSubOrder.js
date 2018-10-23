import getBill         from '../../../functions/getBill'
import getBillAccessories from '@/functions/getBillAccessories'
import getSale         from './getSale'
import activateProduct from './activateProduct'
import roundBill       from '../../../functions/roundBill'

export default {
    stopSubOrder(order, subOrder, send) {
        
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

        // 1) Проставить Время остановки
        subOrder.end_time = subOrder.status === "PAUSE" ? subOrder.pause_start : Date.now()

        // 2) Проставить Стоимость проката
        const billRent = () => {
            const time = subOrder.end_time - Date.parse(order.start_time) - subOrder.pause_time
            return roundBill(getBill(subOrder.tariff_id, time))            
        }

        subOrder.bill_rent = billRent()

        // 3) Проставить Стоимость аксессуаров
        subOrder.bill_access = subOrder.accessories 
            ? getBillAccessories(subOrder.accessories, this.$store.getters.accessories, subOrder.bill_rent) 
            : 0

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

        if (activeSubOrders.length === 0) {
            order.status = "END"
            cmds.push({cmd: 'changeOrder', value: order})
        }


        // 8) Передавать данные на отправку
        if (send) {
            this.$store.dispatch('send', cmds)
        }
    }
}