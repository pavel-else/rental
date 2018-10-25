<template>
    <div class="canvas">
        <div class="details">            
            <table>
                    <tr>
                        <td>Заказ</td>
                        <td>{{order.order_id}}</td>
                    </tr>
                    <tr>
                        <td>Статус</td>
                        <td>{{order.status}}</td>
                    </tr>
                    <tr>
                        <td>Клиент</td>
                        <td>{{order.customer_name}}</td>
                    </tr>
                    <tr>
                        <td>Товары</td>
                        <td>
                            <ul>
                                <li v-for="product in order.products" :key="product.id_rent">{{ product.name }} - {{ product.bill_rent }} р.</li>
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
                        <td><span v-if="order.advance > 0">{{ order.advance }} р.</span><span v-else>-</span></td>
                    </tr>
                    <tr>
                        <td>Скидка</td>
                        <td><span v-if="order.sale > 0">{{ order.sale }} р.</span><span v-else>-</span></td>
                    </tr>
                    <tr class="details__bill" v-if="order.status === 'END'">
                        <td>К оплате</td>
                        <td>{{ order.bill }} р.</td>
                    </tr>
            </table>
            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>

    import getTime from '@/functions/getTime'
    import timeFormat from '@/functions/timeFormat'
    export default {
        name: 'HistoryDetails',
        props: {
            // Ордер должен приходить с просчитанными полями name, bill, sale
            order: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        methods: {
            getTimePlay(item) {
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
    }
</script>

<style scoped>
    .details {
        margin-top: 120px;
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

</style>