<template>
    <div class="history">
        <h2>История заказов</h2>
        <table class="history__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Старт</th>
                <th>В прокате</th>
                <th>Продукт</th>
                <th>Стоимость</th>
                <th>Статус</th>
            </tr>
            <tr v-for="(item, index) in history" @click="onClick(item)">
                <td class="">{{ item.order_id }}</td>
                <td class="">{{ item.customer_name }}</td>
                <td class="">{{ item.start_time }}</td>
                <td>{{ getTimePlay(item) }}</td>
                <td>
                    {{ item.products[0].name }}
                    <span v-if="item.products.length > 1"> и еще {{ item.products.length - 1 }} шт</span>
                </td>
                <td>{{ item.bill }}</td>
                <td>{{ item.status }}</td>
            </tr>
        </table>

        <Details :order="order" @close="onClose" v-if="show"></Details>
    </div>
  
</template>

<script>
    import Details from './Details'
    import getTime from '../../functions/getTime'
    import timeFormat from '../../functions/timeFormat'

    export default {
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
            ...timeFormat,

            getTimePlay(order) {
                const start = order.start_time

                const end = order.products.reduce((acc, product) => {
                    const end = Date.parse(product.end_time)

                    acc = acc < end ? end : acc

                    return acc
                }, null)

                const time = this.getTime(start, new Date(end))

                return this.timeFormat(time)
            },

            onClick(order) {
                //console.log(item)
                this.order = order
                this.show = true
            },
            onClose() {
                this.show = false
            }
        },
        computed: {
            history() {
                const history = this.$store.getters.history
                console.log(history)
                //if (typeof(history) !== 'array') return {}

                const result = history.filter(o => o.order_id > 780)

                return result
            }
        }
    }
</script>

<style>
    .history__table tr:not(:first-child):hover {
        cursor: pointer;
        box-shadow: 0px 0px 1px 0px;
    }

    .history__table td {
        border: 1px solid lightgray;
    }
</style>