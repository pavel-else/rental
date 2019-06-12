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
import productList  from '@/components/Main/product-list';
import orderList    from '@/components/Main/order-list';
import DetailsOrder from '@/components/Main/DetailsOrder/DetailsOrder';

    export default {
        components: {
            productList,
            orderList,
            DetailsOrder
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
        },
        data() {
            return {
                product: {},
                order: {},
                subOrder: null,
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
        }
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
        overflow: hidden;
        &--left {
            width: 420px;
            height: 820px;
            margin-right: 110px;
        }
        &--right {
            width: 420px;
            height: 820px;
            margin-left: 110px;
        }
    }
</style>