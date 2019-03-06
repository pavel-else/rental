<template>
    <div class="canvas">
        <div class="details">            
            <table>
                    <tr>
                        <td>Заказ</td>
                        <td>{{ order.order_id }}</td>
                    </tr>
                    <tr>
                        <td>Статус</td>
                        <td>{{ status(order.status) }}</td>
                    </tr>
                    <tr>
                        <td>Клиент</td>
                        <td>{{ order.customer_name }}</td>
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
                        <td>Стоимость аксессуаров</td>
                        <td>{{ order.access || 0 }} р.</td>
                    </tr>
                    <tr>
                        <td>Начало</td>
                        <td>{{ order.start_time }}</td>
                    </tr>
                    <tr>
                        <td>Завершение</td>
                        <td>{{ endTime() }}</td>
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
            endTime() {
                return this.subOrders.reduce((acc, item) => {
                    acc = item.end_time > acc ? item.end_time : acc;
                    return acc;
                }, this.subOrders[0].end_time);  
            },
            close() {
                this.$emit('close')
            },
            status(status) {
                switch(status) {
                    case 'END': return 'Завершен';
                    case 'ACTIVE': return 'В прокате';
                    default: '';
                }
            }
        },
        computed: {
            subOrders() {
                return this.$store.getters.subOrders.filter(i => i.order_id === this.order.order_id);
            },
        }
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