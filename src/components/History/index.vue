<template>
    <div class="history">
        <h2>История заказов</h2>
        <table cellspacing="0" class="history__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Старт</th>
                <th>В прокате</th>
                <th>Продукт</th>
                <th>Стоимость</th>
                <th>Статус</th>
            </tr>
            <tr v-for="item in history" :key="item.order_id" @click="onClick(item)">
                <td class="">{{ item.order_id }}</td>
                <td class="">{{ item.customer_name }}</td>
                <td class="">{{ item.start_time }}</td>

                <td class="history__td history__td--time">{{ item.play_time }}</td>
                <td>
                    {{getName(item)}}
                    <span v-if="item.products.length > 1"> и еще {{ item.products.length - 1 }} шт</span>
                </td>
                <td>{{ item.bill }} р.</td>
                <td>{{ item.status }}</td>
            </tr>
        </table>

        <Details :order="order" @close="onClose" v-if="show"></Details>
    </div>
  
</template>

<script>
    import Details    from './Details'
    import getTime    from '../../functions/getTime'
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
            ...getTime,

            getTimePlay(order) {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id == order.order_id)
                const start = Date.parse(order.start_time)

                const end = Math.max(subOrders.map(i => Date.parse(i.end_time)))

                const time = start - Date.parse(end)

                return timeFormat(time)
            },

            getName(item) {
                return item.products[0] ? item.products[0].name : ''
            },

            onClick(order) {
                this.order = order
                this.show = true
            },
            onClose() {
                this.show = false
            }
        },
        computed: {
            /**
            * С точки зрения оптимизации выгоднее единожды при создании компонента просчитывать статистические данные.
            * Поэтому перебираем все сабордеры и просчитываем данные для каждого 
            */
            history() {
                let history = this.$store.getters.history

                // history = history.filter(o => o.order_id > 1700) // Ограничитель
                history = history.map(i => {
                    i.subOrders = this.$store.getters.subOrders.filter(j => j.order_id === i.order_id)
                    i.end_time = Math.max(...i.subOrders.map(j => Date.parse(j.end_time) || 0)) || Date.now()
                    i.play_time = i.end_time > 0 ? timeFormat(i.end_time - Date.parse(i.start_time)) : 0

                    const reduce = i.subOrders.reduce((acc, item) => {
                        acc.bill += +item.bill_rent + +item.bill_access - +item.sale
                        acc.sale += +item.sale
                        return acc
                    }, {bill: 0, sale: 0})

                    i.bill = reduce.bill
                    i.sale = reduce.sale

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
</style>