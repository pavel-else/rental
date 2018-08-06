<template>        
    <div class="container">

        <product-list class="tmp" @addOrder="addOrder($event)"></product-list>

        <new-order v-if="showNewOrder"></new-order>

        <order-list class="tmp"></order-list>

        <!-- <addOrder v-if="show" :product="selectProduct" @close="onClose"></addOrder> -->

        <DetailsOrder v-if="show" :data-product="selectProduct" :data-order="order" @close="onClose"></DetailsOrder>
    </div>
</template>

<script>
import productList from './product-list'
import orderList from './order-list'
import DetailsOrder from './DetailsOrder/DetailsOrder'

    export default {
        components: {
            productList,
            orderList,
            DetailsOrder
        },
        data() {
            return {
                selectProduct: {},
                order: {},
                show: false,
            }
        },
        methods: {
            addOrder(product) {
                this.selectProduct = product
                this.show = true
                console.log(product)
            },
            onClose() {
                this.show = false
            }
        },
        computed: {
            showNewOrder() {
                return this.$store.getters.showNewOrder
            }
        },
    }
</script>