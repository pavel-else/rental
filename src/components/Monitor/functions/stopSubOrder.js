import getBill from '@/functions/getBill'
import getBillAccessories from '@/functions/getBillAccessories'
import getSale from '@/functions/getSale'
//import activateProduct from './activateProduct'
import roundBill from '@/functions/roundBill'

import * as Time from '@/functions/Time';

export default {
    stopSubOrder(order, subOrder, send) {
        
        /*
        * Функция должна:
        * Проставить Время остановки
        * Проставить Стоимость проката
        * Проставить Стоимость аксессуаров
        * Просчитать и проставить Скидку
        * Поставить Статус "Стоп"
        * Увеличить пробег велосипеда
        * Если закрывается последний саб - закрывать ордер
        * Передавать данные на отправку

        * Расчеты проводить округленными!
        */

        let cmds = []

        // Проставить Время остановки
        subOrder.end_time = Time.format('YYYY-MM-DD hh:mm:ss');

        // Проставить Стоимость проката
        const time = Date.parse(subOrder.end_time) - Date.parse(order.start_time) - subOrder.pause_time;
        const bill_rent = getBill(subOrder.tariff_id, time);
        subOrder.bill_rent = roundBill(bill_rent);

        // Проставить Стоимость аксессуаров
        const bill_access = getBillAccessories(subOrder.accessories, this.$store.getters.accessories, subOrder.bill_rent);
        subOrder.bill_access = roundBill(bill_access);

        // Просчитать и проставить Скидку
        const sale = getSale(+subOrder.bill_rent + +subOrder.bill_access, +order.customer_id);
        subOrder.sale = roundBill(sale);

        // Поставить Статус "Стоп"
        subOrder.status = "END";

        cmds.push({ cmd: 'changeSubOrder', value: subOrder });

        // Увеличить пробег велосипеда
        const h = time / 1000 / 60 / 60;
        cmds.push({ cmd: 'incMileage', value: { product_id: subOrder.product_id, mileage: h }});


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