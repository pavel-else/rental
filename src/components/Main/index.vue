<template>        
    <div class="desktop">

        <product-list class="snippet snippet__products" @addOrder="addOrder($event)"></product-list>

        <order-list class="snippet snippet__orders" ></order-list>

        <Dialog v-if="show" @close="show = false">
            <DetailsOrder :product="product" @close="show = false"></DetailsOrder>
        </Dialog>
    </div>
</template>

<script>
import productList  from './product-list';
import orderList    from './order-list';
import DetailsOrder from './DetailsOrder/DetailsOrder';
import Dialog       from '@/components/Dialog';

    export default {
        components: {
            productList,
            orderList,
            DetailsOrder,
            Dialog
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
                const timeToUpdateMonitor = this.$store.getters.getGeneralSettings.timeToUpdateMonitor;

                if (timeToUpdateMonitor > 0) {
                    setInterval(() => {
                        const queue = [
                            { cmd: 'getActiveOrders' },
                            { cmd: 'getActiveSubOrders' }
                        ];

                        this.$store.dispatch('multipleRequest', queue);
                    }, timeToUpdateMonitor * 1000);
                }
            }
        },
    };
</script>

<style scoped lang="sass">

.desktop
    max-width: 1024px
    width: 100%
    display: flex
    flex-direction: row
    justify-content: space-between
    
   

    .snippet 
       // border: 1px solid rgba(255,255,255,.1)
       // background: rgba(255,255,255,.05)
    
    .snippet__products
        flex-shrink: 1
        flex-grow: 1

    .snippet__orders
        flex-shrink: 1
        flex-grow: 1

    
    .snippet h3 
        text-align: center

@media screen and (max-width: 810px)
    .desktop
        flex-direction: column

        .snippet
            align-items: stretch
    
</style>