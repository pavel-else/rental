<template>        
    <div class="container">

        <product-list class="tmp" @addOrder="addOrder($event)"></product-list>

        
        <order-list class="tmp"></order-list>

        <!-- <addOrder v-if="show" :product="selectProduct" @close="onClose"></addOrder> -->

        <DetailsOrder v-if="show"   :data-order="order" @close="onClose"></DetailsOrder>
    </div>
</template>

<script>
import getOrderId from '../../functions/getOrderId'
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
                product: {},
                order: {},
                show: false,
            }
        },
        methods: {
            ...getOrderId,


            addOrder(product) {
                this.product = product

                this.order = {
                    status: 'ACTIVE',
                    products: [
                        this.product.id_rent,
                    ],
                    start_time: Math.floor(Date.now() / 1000),

                    order_id: this.getOrderId(),

                    order_id_position: null,
                    advance: null,
                    note: null,
                    promotion: null,
                    accessories: null,
                    tariff: this.product.tariff_default,
                    customer: null     
                },

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