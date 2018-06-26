<template>
    <div class="history">
        <h2>История заказов</h2>
        <table class="history__table">
            <tr v-for="(item, index) in history" :key="index">
                <td>{{item.order_id}}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.customer_name }}</td>
                <td>{{ item.start_time }}</td>
            </tr>
        </table>
    </div>
  
</template>

<script>
    export default {
        computed: {
            history() {
                const history = this.$store.getters.history
                const result = history.filter(o => o.order_id > 780)

                return result
            }
        }
    }
</script>

<style>
    .history__table td {
        border: 1px solid lightgray;
    }
</style>