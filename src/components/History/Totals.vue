<docs>
    <!--
    Выбирает все заказы между 
        o.start_time >= :start_date
        so.end_time < :end_date
    -->
</docs>

<template>
    <div class="history-totals">
        <div class="history-totals__cell"><b>{{ caption }}</b></div>
        <div class="history-totals__cell">Наличные: {{ coin }} руб.</div>
        <div class="history-totals__cell">По карте: {{ card }} руб.</div>
        <div class="history-totals__cell">Всего: {{ coin + card }} руб.</div>
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

        const test = await simpleRequest('getTotals', { dateStart: this.dateStart, dateEnd: this.dateEnd });
        console.log("TEST", test);

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

        &__cell {
            width: 25%;
        }
    }
</style>