<template>
    <div class="details">        
        <table>
                <tr>
                    <td>Заказ</td>
                    <td>{{order.order_id}}</td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>{{order.customer_name}}</td>
                </tr>
                <tr>
                    <td>Товары</td>
                    <td>
                        <ul>
                            <li v-for="product in order.products">{{ product.name }} - {{ product.bill }} р.</li>
                        </ul>
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
                    <td>{{ order.advance }}</td>
                </tr>
                <tr>
                    <td>Скидка</td>
                    <td></td>
                </tr>
                <tr class="details__bill">
                    <td>К оплате</td>
                    <td>{{ bill }} р.</td>
                </tr>
        </table>
        <div class="details__close" @click="close"></div>     
    </div>
</template>

<script>
    export default {
        props: {
            order: Object
        },
        methods: {
            getTimePlay(item) {
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

                const now = this.$store.getters.now

                const products = item.products
                
                let max = null
                let end_time = null
                let diff = null 
                const start_time = Date.parse(item.start_time)

                for (let i = 0; i < products.length; i++) {
                    end_time = products[i].end_time ? Date.parse(products[i].end_time) : null
                    diff = end_time ? end_time - start_time : now - start_time

                    if (diff > max) max = diff                  
                }

                return timeFormat(diff)
            },
            close() {
                this.$emit('close')
            }
        },
        computed: {
            bill() {
                return this.order.products.reduce((acc, product) => {
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

        border: 1px solid lightgray;
        background-color: #fff;
        box-shadow: 0 2px 5px 0px;  
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
</style>