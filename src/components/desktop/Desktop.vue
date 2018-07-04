<template>        
    <div class="container">
        <product-list class="tmp" @addOrder="addOrder($event)"></product-list>

        <new-order v-if="showNewOrder"></new-order>

        <order-list class="tmp"></order-list>

        <addOrder v-if="show" :product="selectProduct" @close="onClose"></addOrder>
    </div>
</template>

<script>
import productList from './product-list'
import orderList from './order-list'
//import newOrder from './new-order'
import addOrder from './addOrder/addOrder'

    export default {
        name: 'Desctop',
        components: {
            productList,
            orderList,
            // newOrder,
            addOrder
        },
        data() {
            return {
                show: false,
                selectProduct: {}
            }
        },
        methods: {
            addOrder(product) {
                this.selectProduct = product
                this.show = true
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