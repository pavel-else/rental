<template>
    <div class="history">
         <Totals
            class="history__totals history_totals__today"
            caption="Итого за сегодня"
            :dateStart="dayjs().format('YYYY-MM-DD 00:00')"
            :dateEnd="dayjs().format('YYYY-MM-DD 23:59')"
        />

         <Totals
            class="history__totals history_totals__yesterday"
            caption="Итого за вчера"
            :dateStart="dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00')"
            :dateEnd="dayjs().subtract(1, 'day').format('YYYY-MM-DD 23:59')"
        />

        <div class="history__filter">
            <input class="history__filter-search" placeholder="Начните вводить фамилию или название" @input="search()">
            <input class="history__filter-date" type="date" v-model="dateStart" :max="dateEnd" @change="reloadHistory">
            <input class="history__filter-date" type="date" v-model="dateEnd" :min="dateStart" @change="reloadHistory">
        </div>

        <h2>История заказов</h2>
        <table class="history__table" v-if="history && history.length > 0" cellspacing="0">
            <tr class="tr__caption">
                <th></th>
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
            </tr>

            <tr v-for="order in historyFilterSlice" :key="order.orderId" @click="onClick(order)">
                <td style="vertical-align: middle">
                    <span class="active-sign" v-if="order.status === 'ACTIVE'"></span>
                </td>
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
                    <span v-if="order.status !== 'ACTIVE'">{{ order.getPlayTime() | playTime }}</span>
                </td>
                <td style="padding-left: 20px">
                    <div
                        v-for="subOrder in order.subOrders.filter(i => i.sub_order_status !== 'DEL')"
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

        <Pagination
            v-if="paginationLength > 0"
            class="history__pagination"
            v-model="page"
            :length="paginationLength"
        />

        <Dialog v-if="show" @close="onClose">
            <Details :order="order" @close="onClose" />
        </Dialog>

    </div>  
</template>

<script>
    import dayjs            from 'dayjs';
    import Details          from './Details';
    import Totals           from './Totals';
    import Dialog           from '@/components/Dialog';
    import Pagination       from '@/elements/Pagination';
    import timeFormat       from '@/functions/timeFormat';
    import * as Time        from '@/functions/time';
    import isValidDate      from '@/functions/isValidDate';
    import makeCustomerName from '@/functions/makeCustomerName';

    export default {
        name: 'History',
        components: {
            Details, Totals, Dialog, Pagination,
        },
        created() {
            // set date range
            this.dateEnd = dayjs().format('YYYY-MM-DD');
            this.dateStart = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

            this.$store.dispatch('multipleRequest', [
                { 
                    cmd: 'getHistorySlice', 
                    value: { 
                        dateStart: dayjs(this.dateStart).format('YYYY-MM-DD 00:00'), 
                        dateEnd: dayjs(this.dateEnd).format('YYYY-MM-DD 23:59'),
                    }
                },
            ]);
        },
        data() {
            return {
                dateEnd: '',
                dateStart: '',
                order: {},
                show: false,
                filt: i => i,
                page: 1,
            }
        },
        methods: {
            dayjs() {
                return dayjs();
            },
            reloadHistory() {
                this.$store.dispatch('multipleRequest', [
                    { 
                        cmd: 'getHistorySlice', 
                        value: { 
                            dateStart: dayjs(this.dateStart).format('YYYY-MM-DD 00:00'), 
                            dateEnd: dayjs(this.dateEnd).format('YYYY-MM-DD 23:59'),
                        }
                    },
                ])
                .then(() => { this.page = 1 });
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

                this.filt = (order) => {
                    const products = this.getProducts(order);

                    if (!products) {
                        return false;
                    }

                    const productMutches = products.filter(product => {
                        const name = product ? product.name : '';
                        return name.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                    });

                    if (productMutches && productMutches.length > 0) {
                        return true;
                    }

                    // Поиск среди ФИО
                    const customerName = this.getCustomerName(order.customerId);
                    const customerMutches = customerName.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;

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
            getProducts(order) {
                const products = order.subOrders.map(subOrder => {
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
        },
        computed: {
            history() {
                return this.$store.getters.history;
            },
            historyFilter() {
                return this.history.filter(this.filt);
            },
            historyFilterSlice() {
                return this.historyFilter.slice((this.page - 1) * 10, this.page * 10);
            },
            products() {
                return this.$store.getters.products;
            },
            customers() {
                return this.$store.getters.customers;
            },
            paginationLength() {
                return this.historyFilter.length ? Math.round(this.historyFilter.length / 10) : 0;
            }
        },
        watch: {
            paginationLength(length) {
                if (length <= this.page) {
                    this.page = length;
                }
            },
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
            playTime(ms) {
                return timeFormat(ms);
            },
        }
    }
</script>

<style lang="scss">
    .history {
        width: 100%;

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
            width: 100%;
            margin-bottom: 35px;

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

        &__pagination {
            width: 320px;
        }
    }
    .history__totals {
        margin-bottom: 20px;
    }
    .active-sign {
        min-width: 5px;
        min-height: 5px;
        border: 2px solid green;
        border-radius: 50%;
        display: block;
    }
</style>