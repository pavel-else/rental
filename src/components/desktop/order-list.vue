<template>
    <div class="snippet snippet__orders">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>

        <table cellspacing="0" class="table">
            <tr 
                class="table-tr" 
                v-for="(item, index) in orders"
                :key="item.order_id"
            >
                <td class="ord__td-2">
                    <Icon :id="item.order_id_position" :show="true"></Icon>
                </td>
                <td class="ord__td-5">{{ item.start_time }}</td>
                <td>
                    <tr v-for="(subitem, index) in item.products">
                        <!-- <td class="ord__td-3">{{ subitem.product_id }}</td> -->
                        <td class="ord__td-4 product_name" @click="changeOrder(item, subitem)">{{ subitem.name }}</td>

                        <td class="ord__td-6">{{ getTimePlay(item.start_time, subitem.end_time) }}</td>
                        <td>{{ getBill(subitem.tariff_id, getTime(item.start_time, item.end_time)) }} р</td>
                        <td class=" ord__td-6 stop-order" @click="stopOrder(item, subitem.product_id)" v-if="!subitem.end_time">x</td>
                    </tr>
                </td>
                <td class="ord__td-7 stop-order-all" @click="stopOrder(item)">x</td>
            </tr>
        </table>

        <DetailsOrder v-if="showDetails" :data-product="product" :data-order="order" :dataStatus="'change'" @close="closeDetails"></DetailsOrder>
        <Resume :order="order" @close="onClose" v-if="showResume"></Resume>
    </div>
</template>

<script>
    import Resume       from './Resume'
    import DetailsOrder from  './DetailsOrder/DetailsOrder'
    import Icon         from  './Icon/Icon'

    import getBill    from '../../functions/getBill'
    import timeFormat from '../../functions/timeFormat'
    import getTime    from '../../functions/getTime'

    export default {
        components: {
            Resume,
            DetailsOrder,
            Icon
        },
        data() {
            return {
                order: null,
                product: null,

                showDetails: false,
                showResume: false,
            }
        },

        methods: {
            ...getBill,
            ...getTime,
            ...timeFormat,

            changeOrder(order, product) {
                this.product = product
                //console.log(product)

                this.showDetails = true
                
                this.order = order
            },
            closeDetails() {
                this.product = null
                this.order = null
                this.showDetails = false
            },

            getTimePlay(start, end) {
                const time = this.getTime(start, end)
                return this.timeFormat(time)
            },

            stopOrder(order, product_id) {
                /*
                * Функция принимает ордер и id продукта, ставит временную метку стопа,
                * прописывает стоимость и отправляет на сервер.
                * Если id продукта не указан, то функция остановки применяется для всех активных ордеров
                */

                if (!order) {
                    console.log('stopOrder: empty order')
                    return false
                }

                const stop = (product_id) => {
                    const product = order.products.find(p => p.product_id == product_id)

                    product.end_time = Math.floor(Date.now() / 1000)
                    product.bill = this.getBill(product.tariff_id, this.getTime(order.start_time, product.end_time))

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
                this.showResume = false
            },

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
        box-sizing: border-box;
        border-collapse: collapse;
        border: none;
        margin: 0;
    }

    .table-tr:nth-child(2n - 1) {
        background-color: rgba(0,0,0,0.02);

    }
    .table th {
        text-align: center;
    }
    .ord__td-1 {
        width: 20px;
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
        text-align: center;
    }
    .ord__td-6 {
        width: 25px;
    }
    .ord__td-7 {
        width: 25px;
    }

    .product_name:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>