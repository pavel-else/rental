<template>        
    <div class="container">
        <product-list class="tmp"></product-list>

        <new-order v-if="showNewOrder"></new-order>

        <order-list class="tmp"></order-list>
    </div>
</template>
<script>
import productList from './product-list'
import orderList from './order-list'
import newOrder from './new-order'

    export default {
        name: 'Desctop',
        components: {
            productList,
            orderList,
            newOrder
        },
        computed: {
            showNewOrder() {
                return this.$store.getters.showNewOrder
            }
        },
    }
</script>