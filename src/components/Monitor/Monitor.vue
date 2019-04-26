<template>        
    <div class="desktop">
        <iframe class="banner banner--left" src=""></iframe>

        <product-list class="snippet snippet__products" @addOrder="addOrder($event)"></product-list>
        
        <order-list class="snippet snippet__orders" ></order-list>

        <iframe class="banner banner--right" src="https://rentix.biz/banners/b1/adv_bike2.html"></iframe>   

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
                { cmd: 'getCategories' },
            ];

            this.$store.dispatch('multipleRequest', queue);  

            this.updateOrders();             
        },
        methods: {
            addOrder(product) {
                this.product = product

                this.show = true
            },
            onClose() {
                this.show = false
            },
            updateOrders() {
                setInterval(() => {
                    const queue = [
                        { cmd: 'getActiveOrders' },
                        { cmd: 'getActiveSubOrders' }
                    ];

                    this.$store.dispatch('multipleRequest', queue);
                }, 5000)
            }
        },

    }
</script>

<style scoped lang="scss">
    .desktop {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .snippet {
        padding: 0 20px;
    }

    .black .snippet {
       // border-left: 3px solid rgba(255,255,255,.1);
       // background: rgba(255,255,255,.05);
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
    .banner {
        border: none;
        margin: 0;
        position: relative;
        &--left {
            width: 400px;
            height: 800px;
            margin-right: 110px;
        }
        &--right {
            width: 400px;
            height: 800px;
            margin-left: 110px;
        }
    }
</style>