<template>
    <div class="canvas">
        <div class="details"> 
            <table>
                    <tr>
                        <td>Заказ</td>
                        <td>{{order.order_id}}</td>
                    </tr>
                    <tr>
                        <td>Клиент</td>
                        <td><span v-if="order.customer_name">{{ order.customer_name }} р.</span><span v-else>-</span></td>
                    </tr>
                    <tr>
                        <td>Товары</td>
                        <td>
                            <table class="table-products">
                                <tr v-for="product in getOrderProducts()">
                                    <td>{{ getProductName(product.product_id) }}</td>
                                    <td>-</td>
                                    <td>{{ product.bill }} р.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>Залог</td>
                        <td><span v-if="order.deposit">{{ order.deposit }}</span><span v-else>-</span></td>
                    </tr>
                    <tr>
                        <td>Начало</td>
                        <td>{{ order.start_time }}</td>
                    </tr>
                    <tr>
                        <td>Чистое время</td>
                        <td>{{ getTimePlay(order) }}</td>
                    </tr>
                    <tr>
                        <td>Аванс</td>
                        <td><span v-if="order.advance > 0">{{ order.advance }} р.</span><span v-else>-</span></td>
                    </tr>
                    <tr>
                        <td>Скидка</td>
                        <td><span v-if="order.sale > 0">{{ order.sale }} р.</span><span v-else>-</span></td>
                    </tr>
                    <tr class="details__bill">
                        <td>К оплате</td>
                        <td>{{ bill }} р.</td>
                    </tr>
            </table>
            <div class="details__close" @click="close"></div>     
        </div>
    </div> 
</template>

<script>
    export default {
        props: {
            order: Object
        },
        methods: {
            getOrderProducts() {
                const subOrders = this.$store.getters.OrderProducts
                return subOrders ? this.$store.getters.OrderProducts.filter(i => i.order_id == this.order.order_id) : []
            },
            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            },

            getTimePlay(order) {
                const timeFormat = function (ms/**number*/) {
                    if (ms < 0) ms = 0;

                    function num(val){
                        val = Math.floor(val);
                        return val < 10 ? '0' + val : val;
                    }
                    
                    var sec = ms / 1000
                      , hours = sec / 3600  % 24
                      , minutes = sec / 60 % 60
                      , seconds = sec % 60
                    ;

                    return num(hours) + ":" + num(minutes) + ":" + num(seconds);
                }

                const start = Date.parse(order.start_time)
                const products = this.getOrderProducts()


                const end = products.reduce((acc, p) => {
                    return acc = acc < p.end_time ? p.end_time : acc
                }, 0)

                const diff = end * 1000 - start

                return timeFormat(diff)
            },

            close() {
                this.$emit('close')
            }
        },
        computed: {
            bill() {
                const products = this.getOrderProducts()

                return products.reduce((acc, product) => {
                    return acc + +product.bill
                }, 0)
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
</style>