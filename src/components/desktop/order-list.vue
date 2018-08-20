<template>
    <div class="order-list">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>

        <table cellspacing="0" class="table">
            <tr 
                class="table-tr" 
                v-for="(item, index) in orders"
                :key="item.order_id"
            >
                <td class="td-1">
                    <Icon :id="item.order_id_position" :show="true"></Icon>
                </td>

                <td class="td-2">{{ item.start_time }}</td>
                
                <td>
                    <tr class="tr-product" v-for="(subitem, index) in item.products">
                        <td class="td-3 product_name" @click="changeOrder(item, subitem)">{{ subitem.name }}</td>

                        <td class="td-4">{{ getTimePlay(item.start_time, subitem.end_time) }}</td>
                        <td class="td-5">{{ getBill(subitem.tariff_id, getTime(item.start_time, subitem.end_time)) }} р</td>

                        <td class="td-6"
                        >
                            <div class="stop-order__wrap">                                
                                <div
                                    class="stop-order" 
                                    @click="stopOrder(item, subitem.product_id)" 
                                    v-if="!subitem.end_time"
                                >
                                </div>
                                <div v-if="subitem.end_time" class="ord__td-6 stop-order_st"></div>
                            </div>
                        </td>
                    </tr>
                </td>

                <td class="td-7">
                    <div class="stop-order__wrap">
                        <div class="stop-order" v-if="item.products.length > 1" @click="stopOrder(item)"></div>
                    </div>
                </td>
            </tr>
        </table>

        <DetailsOrder v-if="showDetails" :data-product="product" :data-order="order" @close="closeDetails"></DetailsOrder>
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
                * Функция принимает ордер и id продукта, ставит временнУю метку стопа,
                * прописывает стоимость и отправляет на сервер.
                * Если id продукта не указан, то функция остановки применяется для всех активных ордеров
                */

                if (!order) {
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

                    this.showResume = true
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
    .stop-order__wrap {
        width: 15px;
        display: flex;
        justify-content: center;
    }

    .stop-order_st {
        width: 7px;
        height: 7px;
        border: 1px solid red;
        border-radius: 50%;

    }
    .td-6:hover .stop-order,
    .td-7:hover .stop-order {
        position: relative;
        opacity: 1;
        cursor: pointer;
        text-align: center;
        width: 13px;
        height: 13px;
        border: 1px solid red;
        border-radius: 50%;
        margin: 0 auto;
    }
    .stop-order::after, 
    .stop-order::before {
        display: block;
        content: '';
        position: absolute;
        width: 9px;
        height: 1px;
        background-color: #333;
        top: 6px;
        left: 2px;
    }
    .stop-order::after {
        transform: rotate(45deg);
    }
    .stop-order::before {
        transform: rotate(-45deg);
    }
    .table td {
        padding: 5px;
        box-sizing: border-box;
        border-collapse: collapse;
        border: none;
        margin: 0;
    }

    .black .table-tr > td {
        border-bottom: 1px solid #333;        
    }
    .white .table-tr > td {
        border-bottom: 1px solid lightgray;        
    }

    .table-tr:nth-child(2n - 1) {
        background-color: rgba(0,0,0,0.01);
    }

    .table th {
        text-align: center;
    }
    .td-1 {
        width: 20px;
    }
    .td-2 {
        width: 100px;
        text-align: center;
    }
    .td-3 {
        width: 240px;
    }
    .td-4 {
        width: 80px;
    }
    .td-5 {
        width: 70px;
        text-align: right;
    }
    .td-6 {
        width: 25px;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;
        padding: 0;
    }
    .td-7 {
        width: 15px;
    }

    .product_name:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>