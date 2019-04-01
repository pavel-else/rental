<template>        
    <div class="desktop">

        <product-list class="snippet snippet__products" @addOrder="addOrder($event)"></product-list>
        
        <order-list class="snippet snippet__orders" ></order-list>

        <DetailsOrder v-if="show" :product="product" @close="onClose"></DetailsOrder>
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
                subOrder: null,
                show: false,
            }
        },
        created() {
                const queue = [
                    { cmd: 'getActiveOrders' }, 
                    { cmd: 'getActiveSubOrders' }, 
                    { cmd: 'getProducts' }, 
                    { cmd: 'getTariffs' }, 
                    { cmd: 'getCustomers' }, 
                    { cmd: 'getAccessories' },
                    { cmd: 'getGeneralSettings' },
                    { cmd: 'getRentalPointInfo' },
                ];

                this.$store.dispatch('multipleRequest', queue);               
        },
        methods: {
            addOrder(product) {
                this.product = product

                this.show = true
            },
            onClose() {
                this.show = false
            },
        },
    }
</script>

<style scoped>
    .desktop {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .snippet {
        padding: 20px;
    }

    .black .snippet {
       border: 1px solid #333; 
    }
    .white .snippet {
       border: 1px solid lightgray;
    }
    .snippet:first-child {
        margin-right: 50px;
    }
    .snippet h3 {
        text-align: center;
    }

</style>