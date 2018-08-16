<template>        
    <div class="container">

        <product-list class="tmp" @addOrder="addOrder($event)"></product-list>

        
        <order-list class="tmp"></order-list>

        <DetailsOrder v-if="show" :data-product="product" @close="onClose"></DetailsOrder>
    </div>
</template>

<script>
import productList  from './product-list'
import orderList    from './order-list'
import DetailsOrder from './DetailsOrder/DetailsOrder'

    export default {
        components: {
            productList,
            orderList,
            DetailsOrder
        },
        data() {
            return {
                product: {},
                order: {},
                show: false,
            }
        },
        methods: {
            addOrder(product) {
                this.product = product
                this.show = true
            },
            onClose() {
                this.show = false
            }
        },
    }
</script>