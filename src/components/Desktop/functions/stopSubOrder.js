import getBill from '@/functions/getBill'
import getBillAccessories from '@/functions/getBillAccessories'
import getSale from '@/functions/getSale'
//import activateProduct from './activateProduct'
import roundBill from '@/functions/roundBill'

export default {
    stopSubOrder(order, subOrder, send) {
        
        /*
        * Функция должна:
        * Проставить Время остановки
        * Проставить Стоимость проката
        * Проставить Стоимость аксессуаров
        * Просчитать и проставить Скидку
        * Поставить Статус "Стоп"
        * Если закрывается последний саб - закрывать ордер
        * Передавать данные на отправку
        */

        let cmds = []

        // Проставить Время остановки
        subOrder.end_time = subOrder.status === "PAUSE" ? subOrder.pause_start : Date.now()

        // Проставить Стоимость проката
        const billRent = () => {
            const time = subOrder.end_time - Date.parse(order.start_time) - subOrder.pause_time
            return roundBill(getBill(subOrder.tariff_id, time))            
        }

        subOrder.bill_rent = billRent()

        // Проставить Стоимость аксессуаров
        subOrder.bill_access = subOrder.accessories 
            ? getBillAccessories(subOrder.accessories, this.$store.getters.accessories, subOrder.bill_rent) 
            : 0

        // Просчитать и проставить Скидку
        subOrder.sale = getSale(+subOrder.bill_rent + +subOrder.bill_access, +order.customer_id)
        console.log(subOrder.sale)

        // Поставить Статус "Стоп"
        subOrder.status = "END"

        cmds.push({cmd: 'changeSubOrder', value: subOrder})


        // Если закрывается последний саб - закрывать ордер
        const activeSubOrders = this.$store.getters.subOrders.filter(i => {
            return i.order_id === subOrder.order_id && (i.status === "ACTIVE" || i.status === "PAUSE")
        })

        if (activeSubOrders.length === 0) {
            order.status = "END"
            cmds.push({ cmd: 'changeOrder', value: order })
        }


        // Передавать данные на отправку
        if (send) {
            this.$store.dispatch('send', cmds)
        }
    }
}