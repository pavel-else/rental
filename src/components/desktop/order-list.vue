<template>
    <div class="snippet snippet__orders">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>
        <table class="table table-bordered">
            <tr v-for="(item, index) in orders">
                <td class="ord__td-1">{{ index + 1 }}</td>
                <td class="ord__td-2">{{ item.order_id_position }}</td>
                <td class="ord__td-5">{{ item.start_time }}</td>
                <td>
                    <tr v-for="(subitem, index) in item.products">
                        <td class="ord__td-3">{{ subitem.product_id }}</td>
                        <td class="ord__td-4">{{ subitem.name }}</td>
                        <td class="ord__td-6">{{ getTimePlay(item.start_time, subitem.end_time) }}</td>
                        <td>{{ getBill(item, subitem.tariff_id) }} р</td>
                        <td class=" ord__td-6 stop-order" @click="stopOrder(item, subitem.product_id)" v-if="!subitem.end_time">x</td>
                    </tr>
                </td>
                <td class="ord__td-7 stop-order-all" @click="stopOrder(item)">x</td>
            </tr>
        </table>
        <Details :order="order" @close="onClose" v-if="order"></Details>
    </div>
</template>

<script>
    import Details      from './details'

    import _getBill     from '../../functions/getBill'
    import _timeFormat  from '../../functions/timeFormat'
    import * as getTime from '../../functions/getTime'

    export default {
        components: {
            Details
        },
        data() {
            return {
                order: null,
            }
        },

        methods: {
            getBill:     _getBill,
            timeFormat:  _timeFormat,

            getTimePlay(start, end) {
                return getTime(123, 321)

                //return this.timeFormat(this.getTime(start, end))
            },

            stopOrder(order, product_id) {
                /*
                * Функция принимает ордер и id продукта, ставит временную метку стопа,
                * прописывает стоимость и отправляет на сервер.
                * Если id продукта не указан, то функция остановки применяется для всех активных ордеров
                */

                if (!order) console.log('stopOrder: empty order')
                if (!product_id) console.log('stopOrder: empty product_id')
                // сервер принимает 1шт продукт

                const stop = (product_id) => {
                    const product = order.products.find(p => p.product_id == product_id)

                    product.end_time = Math.floor(Date.now() / 1000)

                    const getBill = this.$store.getters.getBill()

                    product.bill = getBill(order, product_id)

                    this.$store.dispatch('send', {
                        cmd: 'stopOrder',
                        value: product
                    })
                }

                const stopAll = () => {
                    const products = order.products.filter(p => p.end_time == null)

                    products.map(p => {
                        stop(p.product_id)
                    })
                }
                this.order = order
                return product_id ? stop(product_id) : stopAll()
                
            },

            onClose() {
                this.order = null
            }
        },

        computed: {
            orders() {
                return this.$store.getters.orders
            },
            products() {
                return this.$store.getters.products
            },
        }
    }
</script>

<style scoped>
    .empty {
        padding: 0 20px;
    }
    .stop-order {
        opacity: 0;
    }
    .stop-order:hover {
        opacity: 1;
        cursor: pointer;
        text-align: center;
    }
    .stop-order-all {
        opacity: 0;
    }
    .stop-order-all:hover {
        opacity: 1;
        cursor: pointer;
        text-align: center;
    }

    .table td {
        padding: 5px;
        border: 1px solid lightgray;
        box-sizing: border-box;
    }
    .table th {
        text-align: center;
    }
    .ord__td-1 {
        width: 25px;
    }
    .ord__td-2 {
        width: 40px;
    }
    .ord__td-3 {
        width: 25px;
    }
    .ord__td-4 {
        width: 180px;
    }
    .ord__td-5 {
        width: 120px;
    }
    .ord__td-6 {
        width: 25px;
    }
    .ord__td-7 {
        width: 25px;
    }
</style>