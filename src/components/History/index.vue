<template>
    <div class="history">
        <div class="totals">
            <table>
                <tr>
                    <td><b>Итого за день:</b></td>
                    <td>Наличные: {{ coin }} руб.</td>
                    <td>По карте: {{ card }} руб.</td>
                    <td>Всего: {{ total }} руб.</td>
                </tr>
            </table>
        </div>

        <input class="input__serch" placeholder="Начните вводить фамилию или название" @input="search()">

        <h2>История заказов</h2>
        <table class="history__table" v-if="orders && orders.length > 0" cellspacing="0">
            <tr class="tr__caption">
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
            </tr>

            <tr v-for="order in orders.filter(filt)" :key="order.id_rent" @click="onClick(order)">
                <td>
                    {{ order.id_rent }}
                </td>
                <td>                    
                    {{ order.customerName }}                
                </td>
                <td style="text-align: right">
                    {{ order.start_time | shortDate }}
                </td>
                <td style="text-align: right">
                    {{ order.play_time }}
                </td>
                <td style="padding-left: 20px">
                    <div class="product" v-for="(product, index) in order.products" :key="order.id_rent + '_' + product.id_rent + '_' + index">
                        {{ product.name }}
                    </div>
                </td>
                <td style="text-align: right">
                    {{ order.bill }} руб
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
        beforeCreate() {
            this.$store.dispatch('multipleRequest', [
                { cmd: 'getOrders' },
                { cmd: 'getSubOrders'},
                { cmd: 'getProducts' },
                { cmd: 'getCustomers' }
            ]);
        },
        data() {
            return {
                order: {},
                show: false,
                filt: i => i,
            }
        },
        methods: {
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

                return orders.sort((a, b) => Date.parse(b.end_time) - Date.parse(a.end_time));               
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
        .input__serch {
            width: 100%;
            margin-top: 25px;
        }        
        h2 {
            margin-top: 50px;
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
    .totals {
        table {
            width: 100%;
        }

        td {
            padding: 5px 10px;
        }
    }
</style>