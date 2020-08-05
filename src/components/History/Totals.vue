<docs>
    <!--
    Выбирает все заказы между 
        o.start_time >= :start_date
        so.end_time < :end_date
    -->
</docs>

<template>
    <div class="history-totals">
        <div class="history-totals__cell history-totals__cell--caption"><b>{{ caption }}: {{ advance + coin + card }} руб.</b></div>
        <div class="history-totals__cell">Наличные: {{ coin }} руб.</div>
        <div class="history-totals__cell">По карте: {{ card }} руб.</div>
        <div class="history-totals__cell" v-if="advance">Аванс: {{ advance }} руб.</div>
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
        // const response = await simpleRequest('getHistorySlice', { dateStart: this.dateStart, dateEnd: this.dateEnd });

        const response = await simpleRequest('getTotals', { dateStart: this.dateStart, dateEnd: this.dateEnd });
        console.log("TEST", response);
        this.totals = response ? response.totals : null;

    },
    data() {
        return {
            totals: null,
        }
    },
    computed: {
        advance() {
            return this.totals && this.totals.advance ? this.totals.advance : 0;
        },
        coin() {
            return this.totals && this.totals.coin ? this.totals.coin : 0;
        },
        card() {
            return this.totals && this.totals.card ? this.totals.card : 0;
        },
    },

}
</script>

<style lang="scss">
    .history-totals {
        width: 100%;
        display: flex;
        // justify-content: space-between;

        &__cell {
            min-width: 150px;
            white-space: nowrap;
        }
        &__cell--caption {
            min-width: 200px;
        }
    }
</style>