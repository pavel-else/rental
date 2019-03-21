<template>
    <div class="history">
        <h2>История заказов</h2>
        <table v-if="orders && orders.length > 0" cellspacing="0" class="history__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
                <!-- <th>Статус</th> -->
            </tr>
            <!-- <tr v-for="item in history" :key="item.order_id" @click="onClick(item)">
                <td class="">{{ item.order_id }}</td>
                <td class="">{{ item.customer_name }}</td>
                <td class="history__td--start">{{ item.short_start_time }}</td>

                <td class="history__td history__td--time">{{ item.play_time }}</td>
                <td>
                    {{ getName(item) }}
                    <span v-if="item.products.length > 1"> и еще {{ item.products.length - 1 }} шт</span>
                </td>
                <td>{{ item.bill }} р.</td>
                <td>{{ getStatus(item.status) }}</td>
            </tr> -->
            <tr v-for="item in orders" :key="item.id_rent">
                <td>
                    {{ item.id_rent }}
                </td>
                <td>                    
                    {{ item.customer_name }}                
                </td>
                <td style="text-align: right">
                    {{ shortDate(item.start_time) }}
                </td>
                <td style="text-align: right">
                    {{ item.play_time }}
                </td>
                <td style="padding-left: 20px">
                    {{ item.productName }}
                </td>
                <td style="text-align: right">
                    {{ item.bill }} руб
                </td>
                <!-- <td>
                    {{ item.formStatus }}
                </td> -->
            </tr>
        </table>
        <div v-else>Здесь пока пусто..</div>

        <Details :order="order" @close="onClose" v-if="show"></Details>
    </div>
  
</template>

<script>
    import Details    from './Details';
    import timeFormat from '@/functions/timeFormat';
    import copy       from '@/functions/copy';
    import * as Time  from '@/functions/Time';
    import isValidDate from '@/functions/isValidDate';

    export default {
        name: 'History',
        components: {
            Details
        },
        beforeCreate() {
            // this.$store.dispatch('getHistory');
            this.$store.dispatch('getOrders', 'all');
            this.$store.dispatch('getSubOrders');
            this.$store.dispatch('getProducts');
        },
        data() {
            return {
                order: {},
                show: false
            }
        },
        methods: {
            getEndTime(orderId) {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id === orderId);
                const end_time = subOrders.reduce((acc, item) => {
                    if (!acc) {
                        acc = item.end_time;
                    }

                    if (Date.parse(acc) < Date.parse(item.end_time)) {
                        acc = item.end_time;
                    }


                    return acc;
                }, null);
                
                return end_time;
            },
            getProductName(orderId) {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id === orderId);
                const firstProductId = subOrders && subOrders.length > 0 ? subOrders[0].product_id : false;

                if (!subOrders || subOrders.length < 1 || !firstProductId) {
                    return '';
                }

                const product = this.$store.getters.products.find(i => i.id_rent === firstProductId);
                const firstName = product ? product.name : '';

                return subOrders.length > 1 
                    ? firstName + ' и еще ' + (subOrders.length - 1)
                    : firstName;
            },
            getBill(orderId) {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id === orderId);
                const bill = subOrders.reduce((acc, item) => {
                    acc += +item.bill_rent;
                    acc += +item.bill_access;
                    acc -= +item.sale;
                    return acc;
                }, 0);

                return bill;                
            },
            getStatus(order) {
                const status = order.status;
                switch (status) {
                    case 'ACTIVE': return 'В прокате';
                    case 'END': return 'Завершен';
                    default: return status;
                }
            },
            getTimePlay(start, end) {
                const end_time = Date.parse(end);
                const start_time = Date.parse(start);

                if (isNaN(end_time) || isNaN(start_time)) {
                    return 'Ошибка парсинга';
                }

                return timeFormat(end_time - start_time);
            },
            shortDate(date) {
                const now = new Date();
                const today = now.getDate();
                const orderDate = new Date(date);

                if (!isValidDate(orderDate)) {
                    return 'Ошибка парсинга';
                }

                const format = orderDate.getDate() === today ? 'HHч mmм' : 'DD MMMM YYYY';

                return Time.format(format, orderDate);
            },


            onClick(order) {
                this.order = order
                this.show = true
            },
            onClose() {
                this.show = false
            },

        },
        computed: {
            /**
            * С точки зрения оптимизации выгоднее единожды при создании компонента просчитывать статистические данные.
            * Поэтому перебираем все сабордеры и просчитываем данные для каждого 
            */
            // history() {
            //     let history = this.$store.getters.history

            //     // history = history.filter(o => o.id_rent > 1700) // Ограничитель
            //     history = history.map(i => {
            //         i.subOrders = this.$store.getters.subOrders.filter(j => j.order_id === i.id_rent);

            //         i.end_time = Math.max(...i.subOrders.map(j => Date.parse(j.end_time) || 0)) || Date.now();

            //         i.play_time = i.end_time > 0 ? timeFormat(i.end_time - Date.parse(i.start_time), { sec: false }) : 0
            //         // i.play_time = i.end_time - Date.parse(i.start_time);

            //         i.short_start_time = this.shortDate(i.start_time);

            //         const reduce = i.subOrders.reduce((acc, item) => {
            //             acc.access += +item.bill_access
            //             acc.bill += +item.bill_rent + +item.bill_access - +item.sale
            //             acc.sale += +item.sale
            //             return acc
            //         }, {access: 0, bill: 0, sale: 0})

            //         i.bill = reduce.bill
            //         i.sale = reduce.sale
            //         i.access = reduce.access

            //         return i
            //     })

            //     return history
            // },

            orders() {
                const orders = this.$store.getters.orders.reduce((acc, _item) => {
                    const item = copy(_item);

                    // Отсеиваем завершенные
                    if (item.status !== 'END') {
                        return acc;
                    }

                    item.end_time = this.getEndTime(item.id_rent);
                    item.play_time = this.getTimePlay(item.start_time, item.end_time);
                    item.productName = this.getProductName(item.id_rent);
                    item.bill = this.getBill(item.id_rent);
                    item.formStatus = this.getStatus(item);

                    acc.push(item);
                    return acc;
                }, []);

                return orders;
            }
        }
    }
</script>

<style scoped>
    .history {
    }
    .history__table tr:not(:first-child):hover {
        cursor: pointer;
        box-shadow: 0px 0px 1px 0px;
    }

    .black .history__table td {
        padding: 5px 10px;
    }
    .history__td--time {
        text-align: right;
    }
    .history__td--start {
        text-align: right;
    }
</style>