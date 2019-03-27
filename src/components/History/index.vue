<template>
    <div class="history">
        <!-- <Totals></Totals> -->

        <h2>История заказов</h2>
        <table class="history__table" v-if="orders && orders.length > 0" cellspacing="0">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
            </tr>

            <tr v-for="item in orders" :key="item.id_rent" @click="onClick(item)">
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
            </tr>
        </table>
        <div v-else>Здесь пока пусто..</div>

        <Details :_order="order" @close="onClose" v-if="show"></Details>
    </div>  
</template>

<script>
    import Details     from './Details';
    import Totals      from '@/components/Totals';
    import timeFormat  from '@/functions/timeFormat';
    import copy        from '@/functions/copy';
    import * as Time   from '@/functions/Time';
    import isValidDate from '@/functions/isValidDate';

    export default {
        name: 'History',
        components: {
            Details, Totals
        },
        beforeCreate() {
            this.$store.dispatch('multipleRequest', [
                { cmd: 'getOrders' },
                { cmd: 'getSubOrders'},
                { cmd: 'getProducts'}
            ]);
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
                this.order = order;
                this.show = true;
            },
            onClose() {
                this.show = false;
            },

        },
        computed: {
            orders() {
                const compleated = this.$store.getters.orders.filter(i => i.status === 'END');
                const orders = compleated.reduce((acc, _item) => {
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

                return orders.sort((a, b) => Date.parse(b.end_time) - Date.parse(a.end_time));               
            },
        }
    }
</script>

<style lang="scss" scoped>
    .history {        
        h2 {
            margin-top: 50px;
        }
        &__table {
            td {
                padding: 5px;
            }
            tr:not(:first-child):hover {
                outline: 1px solid #333;
                cursor: pointer;
            }
        }
    }
</style>