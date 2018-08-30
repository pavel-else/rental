<template>
    <div class="canvas">
        <div class="details"> 
            <table>
                    <tr>
                        <td>Заказ</td>
                        <td> # {{ order.order_id }}</td>
                    </tr>
                    <tr>
                        <td>Клиент</td>
                        <td>
                            <span v-if="order.customer_name">{{ order.customer_name }} р.</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Товары</td>
                        <td>
                            <table class="table-products">
                                <tr 
                                    v-for="item in subOrders" 
                                    :class="getClass(item.product_id)"
                                >
                                    <td>{{ getProductName(item.product_id) }}</td>
                                    <td>-</td>
                                    <td>{{ item.bill }} р.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>Залог</td>
                        <td>
                            <span v-if="order.deposit">{{ order.deposit }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Начало</td>
                        <td>{{ order.start_time }}</td>
                    </tr>
                    <tr>
                        <td>Чистое время</td>
                        <td>{{ activeTime }}</td>
                    </tr>
                    <tr>
                        <td>Аванс</td>
                        <td>
                            <span v-if="order.advance > 0">{{ order.advance }} р.</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Скидка</td>
                        <td>
                            <span v-if="order.sale > 0">{{ order.sale }} р.</span>
                            <span v-else>-</span>
                        </td>
                    </tr>

                    <tr>
                        <td>Стоимость заказа</td>
                        <td>{{ total }} р.</td>
                    </tr>

                    <tr class="details__bill">
                        <td>К оплате</td>
                        <td>{{ total - order.advance }} р.</td>
                    </tr>
            </table>
            <div class="details__close" @click="close"></div>     
        </div>
    </div> 
</template>

<script>
    import timeFormat from '../../functions/timeFormat'
    import getTime    from '../../functions/getTime'

    export default {
        props: {
            order:    Object,
            subOrder: Object
        },
        data() {
            return {
                subOrders: this.$store.getters.orderProducts.filter(i => i.order_id == this.order.order_id)
            }
        },

        methods: {
            ...getTime,
            ...timeFormat,

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            },
            getClass(product_id) {
                return {
                    select : this.subOrder.product_id == product_id
                }
            },

            close() {
                this.$emit('close')
            },
        },

        computed: {
            total() {

                return this.subOrders ? this.subOrders.reduce((acc, subOrder) => {
                    return acc + +subOrder.bill
                }, 0) : 0   
            },



            activeTime() {
                const start = this.order.start_time
                const end   = this.subOrder.end_time
                const pause = this.subOrder.pause_time

                const time = this.getTime(start, end)


                return this.timeFormat(time - pause)
            }
        }


    }
</script>

<style scoped>
    .details {
        position: absolute;
        top: 100px;
        left: calc(50% - 150px);
        min-width: 300px;
        padding: 5px 10px;
    }

    td {
        padding: 5px;
    }

    td:first-child {
        padding-right: 10px;
    }
    .details li {
        display: block;
        margin: 0;
    }
    .details__bill td {
        padding-top:  20px;
        font-weight: bold;
    }

    .details__close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
    }
    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 9px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
    }

    .table-products {
        padding: 0;
        margin: 0;
    }
    .table-products td {
        padding: 2px 5px;
    }
    .select {
        outline: 1px solid #333;
    }
</style>