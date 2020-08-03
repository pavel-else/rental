<docs>
    <!--
    Выбирает все заказы между 
        o.start_time >= :start_date
        so.end_time < :end_date
    -->
</docs>

<template>
    <div class="history-totals">
        <div><b>{{ caption }}</b></div>
        <div>Наличные: {{ coin }} руб.</div>
        <div>По карте: {{ card }} руб.</div>
        <div>Всего: {{ coin + card }} руб.</div>
    </div>  
</template>

<script>
import simpleRequest from '@/functions/simpleRequest';

export default {
    name: 'Totals',
    props: {
        caption: String,
        dateStart: String,
        dateEnd: String,
    },
    async created() {
        const response = await simpleRequest('getHistorySlice', { dateStart: this.dateStart, dateEnd: this.dateEnd });
        this.subOrders = response ? response.history_slice : null;
    },
    data() {
        return {
            subOrders: null,
        }
    },
    computed: {
        coin() {
            if (!this.subOrders) {
                return 0;
            }
            const filterByCoin = this.subOrders.filter(i => i.paid === 'coin');
            return filterByCoin.reduce((acc, item) => {
                acc += +item.bill_rent + +item.bill_access - +item.sale;

                return acc;
            }, 0);
        },
        card() {
            if (!this.subOrders) {
                return 0;
            }
            const filterByCard = this.subOrders.filter(i => i.paid === 'card');
            return filterByCard.reduce((acc, item) => {
                acc += +item.bill_rent + +item.bill_access - +item.sale;
                return acc;
            }, 0);
        },
    },
}
</script>

<style lang="scss">
    .history-totals {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>