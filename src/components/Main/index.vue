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
        created() {
            // Костыль
            this.updateOrders();
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
            },
            updateOrders() {
                setInterval(() => {
                    const queue = [
                        { cmd: 'getActiveOrders' },
                        { cmd: 'getActiveSubOrders' }
                    ];

                    this.$store.dispatch('multipleRequest', queue);
                }, 5000);
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
       border: 1px solid rgba(255,255,255,.1);
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
</style>