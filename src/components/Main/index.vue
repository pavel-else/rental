<template>        
    <div class="main-page">
        <product-list class="main-page__products" @addOrder="addOrder($event)" />

        <order-list class="main-page__orders" />

        <Dialog v-if="show" @close="show = false">
            <DetailsOrder :product="product" @close="show = false" />
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
            this.product = product;
            this.show = true;
        },
        onClose() {
            this.show = false;
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

<style lang="scss">
.main-page {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &__products {
        flex-shrink: 2;
    }
}
</style>