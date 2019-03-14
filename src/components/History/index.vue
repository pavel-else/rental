<template>
    <div class="history">
        <h2>История заказов</h2>
        <table v-if="history && history.length > 0" cellspacing="0" class="history__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Начало</th>
                <th>Длительность</th>
                <th>Товар</th>
                <th>Стоимость</th>
                <th>Статус</th>
            </tr>
            <tr v-for="item in history" :key="item.order_id" @click="onClick(item)">
                <td class="">{{ item.order_id }}</td>
                <td class="">{{ item.customer_name }}</td>
                <td class="history__td--start">{{ item.short_start_time }}</td>

                <td class="history__td history__td--time">{{ item.play_time }}</td>
                <td>
                    {{getName(item)}}
                    <span v-if="item.products.length > 1"> и еще {{ item.products.length - 1 }} шт</span>
                </td>
                <td>{{ item.bill }} р.</td>
                <td>{{ getStatus(item.status) }}</td>
            </tr>
        </table>
        <div v-else>Здесь пока пусто..</div>

        <Details :order="order" @close="onClose" v-if="show"></Details>
    </div>
  
</template>

<script>
    import Details    from './Details'
    import timeFormat from '@/functions/timeFormat'

    export default {
        name: 'History',
        components: {
            Details
        },
        data() {
            return {
                order: {},
                show: false
            }
        },
        methods: {
            getTimePlay(order) {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id == order.id_rent)
                const start = Date.parse(order.start_time)

                const end = Math.max(subOrders.map(i => Date.parse(i.end_time)))

                const time = start - Date.parse(end)

                return timeFormat(time)
            },

            getName(item) {
                return item.products[0] ? item.products[0].name : ''
            },
            getStatus(status) {
                switch(status) {
                    case 'END': return 'Завершен';
                    case 'ACTIVE': return 'В прокате';
                    default: '';
                }
            },

            onClick(order) {
                this.order = order
                this.show = true
            },
            onClose() {
                this.show = false
            },
            shortDate(date) {
                if (!date || isNaN(Date.parse(date) || Date.parse(date) < 0)) {
                    console.log('Date.parse error!');
                    return false;
                }

                const getMonth = (date) => {
                    const position = date.getMonth();
                    // const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
                    const months2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

                    return months2[position];
                };

                const getYear = (date) => {
                    const fullYear = String(date.getFullYear());
                    return fullYear.substr(2, 2);
                };

                const getHours = (date) => {
                    const hours = date.getHours();
                    return 0 < hours && hours < 10 ? `0${ hours }` : `${ hours }`;
                };
                const getMinutes = (date) => {
                    const minutes = date.getMinutes();
                    return 0 < minutes && minutes < 10 ? `0${ minutes }` : `${ minutes }`;
                };

                const dateObject = new Date(date);

                const y = getYear(dateObject);
                const m = getMonth(dateObject);
                const d = dateObject.getDate();
                const h = getHours(dateObject);
                const min = getMinutes(dateObject);

                const today = new Date();

                if (today.getDate() === d) {
                    return `${ h }:${ min }`;
                }
                if (today.getDate() === d - 1) {
                    return `вчера ${ h }:${ min }`;
                }

                return `${ d }.${ m }.${ y }  ${ h }:${ min }`;
            }
        },
        computed: {
            /**
            * С точки зрения оптимизации выгоднее единожды при создании компонента просчитывать статистические данные.
            * Поэтому перебираем все сабордеры и просчитываем данные для каждого 
            */
            history() {
                let history = this.$store.getters.history

                // history = history.filter(o => o.id_rent > 1700) // Ограничитель
                history = history.map(i => {
                    i.subOrders = this.$store.getters.subOrders.filter(j => j.order_id === i.id_rent)
                    i.end_time = Math.max(...i.subOrders.map(j => Date.parse(j.end_time) || 0)) || Date.now()
                    i.play_time = i.end_time > 0 ? timeFormat(i.end_time - Date.parse(i.start_time), { sec: false }) : 0
                    // i.play_time = i.end_time - Date.parse(i.start_time);

                    i.short_start_time = this.shortDate(i.start_time);

                    const reduce = i.subOrders.reduce((acc, item) => {
                        acc.access += +item.bill_access
                        acc.bill += +item.bill_rent + +item.bill_access - +item.sale
                        acc.sale += +item.sale
                        return acc
                    }, {access: 0, bill: 0, sale: 0})

                    i.bill = reduce.bill
                    i.sale = reduce.sale
                    i.access = reduce.access

                    return i
                })

                return history
            },
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