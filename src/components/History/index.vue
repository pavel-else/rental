<template>
    <div class="history">
        <!-- <div class="history__totals">
            <table>
                <tr>
                    <td><b>Итого за день:</b></td>
                    <td>Наличные: {{ coin }} руб.</td>
                    <td>По карте: {{ card }} руб.</td>
                    <td>Всего: {{ total }} руб.</td>
                </tr>
            </table>
        </div>
-->
        <div class="history__filter">
            <input class="history__filter-search" placeholder="Начните вводить фамилию или название" @input="search()">
            <input class="history__filter-date" type="date" v-model="dateStart" :max="dateEnd">
            <input class="history__filter-date" type="date" v-model="dateEnd" :min="dateStart">
            <button class="history__filter-button" @click="reloadHistory">Ok</button>
        </div>

        <h2>История заказов</h2>
        <table class="history__table" v-if="history" cellspacing="0">
            <tr class="tr__caption">
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
            </tr>

            <!-- <tr v-for="order in orders.filter(filt)" :key="order.id_rent" @click="onClick(order)"> -->
            <tr v-for="order in history" :key="order.orderId" @click="onClick(order)">
                <td>
                    {{ order.orderId }}
                </td>
                <td>                    
                    {{ getCustomerName(order.customerId) }}                
                </td>
                <td style="text-align: right">
                    {{ order.startTime | shortDate }}
                </td>
                <td style="text-align: right">
                    {{ getTimePlay(order.startTime, order.subOrders[0].end_time, order.orderId) }}
                </td>
                <td style="padding-left: 20px">
                    <div
                        v-for="subOrder in order.subOrders"
                        :key="subOrder.sub_order_id"
                    >
                        {{ getProductName(subOrder.product_id) }}
                    </div>
                </td>
                <td style="text-align: right">
                    {{ order.getBill() }} руб
                </td>
            </tr>
        </table>
        <div v-else>Здесь пока пусто..</div>

        <Dialog v-if="show" @close="onClose">
            <Details :_order="order" @close="onClose" />
        </Dialog>

    </div>  
</template>

<script>
    import dayjs            from 'dayjs';
    import Details          from './Details';
    import Dialog           from '@/components/Dialog';
    import Totals           from '@/components/Totals';
    import timeFormat       from '@/functions/timeFormat';
    import copy             from '@/functions/copy';
    import * as Time        from '@/functions/time';
    import isValidDate      from '@/functions/isValidDate';
    import makeCustomerName from '@/functions/makeCustomerName';

    export default {
        name: 'History',
        components: {
            Details, Totals, Dialog
        },
        created() {
            // set date range
            this.dateEnd = dayjs().format('YYYY-MM-DD');
            this.dateStart = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

            this.$store.dispatch('multipleRequest', [
                { cmd: 'getHistorySlice', value: { dateStart: this.dateStart, dateEnd: this.dateEnd }},
            ]);
        },
        data() {
            return {
                dateEnd: '',
                dateStart: '',
                order: {},
                show: false,
                filt: i => i,
            }
        },
        methods: {
            reloadHistory() {
                this.$store.dispatch('multipleRequest', [
                    { cmd: 'getHistorySlice', value: { dateStart: this.dateStart, dateEnd: this.dateEnd }},
                ]); 
            },
            totalBill(item) {
                return +item.bill_rent + +item.bill_access - +item.sale;
            },
            getProductName(id) {
                const product = this.products.find(i => i.id_rent === id);
                return product ? product.name : '';
            },
            search() {
                // Метод просто обновляет фильтр, через который Vue пропускает список
                const searchText = event.target.value.trim();

                this.filt = order => {
                    const products = this.getProducts(order.id_rent);

                    const productMutches = products.filter(product => {
                        const name = product ? product.name : '';
                        return name.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                    });

                    if (productMutches && productMutches.length > 0) {
                        return true;
                    }

                    // Поиск среди ФИО
                    const customerMutches = order.customerName.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;

                    if (customerMutches) {
                        return true;
                    }
                };
            },
            onClick(order) {
                this.order = order;
                this.show = true;
            },
            onClose() {
                this.show = false;
            },

            // Блок вспомогательных методов для свойства orders
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
            getCustomerName(customerId) {
                if (!customerId) {
                    return '';
                }

                const customer = this.$store.getters.customers.find(i => i.id_rent === customerId);

                if (!customer) {
                    console.warn('History.index.getCustomerName: Клиент не найден!');
                }
                return customer ? makeCustomerName(customer) : '';
            },
            getProducts(orderId) {
                const subOrders = this.$store.getters.subOrders;
                const subOrdersByOrderId = subOrders.filter(i => i.order_id === orderId && i.status !== 'DEL');
                const products = subOrdersByOrderId.map(subOrder => {
                    const product = this.$store.getters.products.find(product => product.id_rent === subOrder.product_id);

                    return product ? product : null;
                });

                return products.filter(i => i); // В списке есть удаленные товары, т.е. i === null
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
            getTimePlay(start, end, orderId) {
                const end_time = Date.parse(end);
                const start_time = Date.parse(start);

                if (isNaN(end_time) || isNaN(start_time)) {
                    return 'Ошибка парсинга. order_id = ' + orderId;
                }

                return timeFormat(end_time - start_time);
            },
        },
        computed: {
            history() {
                return this.$store.getters.history;
            },
            products() {
                return this.$store.getters.products;
            },
            customers() {
                return this.$store.getters.customers;
            },
            orders() {
                const compleated = this.$store.getters.orders.filter(i => i.status === 'END');
                const orders = compleated.reduce((acc, _item) => {
                    const item = copy(_item);

                    item.customerName = this.getCustomerName(item.customer_id);
                    item.end_time = this.getEndTime(item.id_rent);
                    item.play_time = this.getTimePlay(item.start_time, item.end_time, item.id_rent);
                    item.products = this.getProducts(item.id_rent);
                    item.bill = this.getBill(item.id_rent);
                    item.formStatus = this.getStatus(item);

                    acc.push(item);

                    return acc;
                }, []);

                return orders.sort((a, b) => Date.parse(b.end_time) - Date.parse(a.end_time) > 0 ? 1 : -1);
            },

            // FOR TOTAL
            currentSubOrders() {
                const isCurrent = (endTime, subOrderId) => {
                    const obj = new Date(endTime);

                    if (!isValidDate(obj)) {
                        console.warn('Totals: date parse error. subOrderId = ' + subOrderId);
                        return false;
                    }

                    const today = new Date();

                    return obj.getDate() === today.getDate()
                        && obj.getMonth() === today.getMonth()
                        && obj.getYear() === today.getYear();
                };

                return this.$store.getters.subOrders.filter(i => isCurrent(i.end_time, i.id_rent));
            },
            coin() {
                const filterByCoin = this.currentSubOrders.filter(i => i.paid === 'coin');
                return filterByCoin.reduce((acc, item) => {
                    acc += +item.bill_rent + +item.bill_access - +item.sale;

                    return acc;
                }, 0);
            },
            card() {
                const filterByCard = this.currentSubOrders.filter(i => i.paid === 'card');
                return filterByCard.reduce((acc, item) => {
                    acc += +item.bill_rent + +item.bill_access - +item.sale;
                    return acc;
                }, 0);
            },
            total() {
                return this.coin + this.card;
            }
        },

        filters: {
            shortDate(date) {
                const orderDate = new Date(date);

                if (!isValidDate(orderDate)) {
                    return 'Ошибка парсинга';
                }

                const isToday= (date) => {
                    const now = new Date();

                    if (date.getDate() !== now.getDate()) {
                        return false;
                    }
                    if (date.getMonth() !== now.getMonth()) {
                        return false;
                    }
                    if (date.getFullYear() !== now.getFullYear()) {
                        return false;
                    }

                    return true;
                };

                const format = isToday(orderDate) ? 'HH:mm' : 'DD MMMM YYYY';

                return Time.format(format, orderDate);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .history {
        h2 {
            margin-top: 50px;
        }

        &__filter {
            width: 100%;
            display: flex;

            &-search {
                width: 100%;
                margin-right: 20px;
            }
            
            &-date {
                min-width: 130px;
                margin-right: 10px;
            }
            ::-webkit-calendar-picker-indicator {
                color: transparent;
                opacity: 1;
                background: url('https://c7.hotpng.com/preview/590/31/787/computer-icons-mcmahon-ryan-child-advocacy-center-calendar-clip-art-restart.jpg') no-repeat center;
                background-size: contain;
            }
        }

        &__table {
            td {
                padding: 5px 15px;
                vertical-align: top;              
            }
            tr:not(:first-child):hover {
                outline: 1px solid #333;
                cursor: pointer;

            }
            .tr__caption th {
                padding: 10px 0;
            }
            .product {
                padding-bottom: 5px;
            }
        }
    }
    .history__totals {
        margin-bottom: 20px;
        table {
            width: 100%;
        }

        td {
            padding: 5px 10px;
        }
    }
</style>