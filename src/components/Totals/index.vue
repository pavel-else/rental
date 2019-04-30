<template>
    <div class="totals">
        <table>
            <tr>
                <td><b>Итого за день:</b></td>
                <td>Наличные: {{ coin }} руб.</td>
                <td>По карте: {{ card }} руб.</td>
                <td>Всего: {{ total }} руб.</td>
            </tr>

        </table>
    </div>
</template>
<script>
    import isValidDate from '@/functions/isValidDate';
    export default {
        beforeCreate() {
            this.$store.dispatch('getSubOrders');
        },
        data() {
            return {

            }
        },
        methods: {
            getBill(subOrder) {
                return +subOrder.bill_rent + +subOrder.bill_access - +subOrder.sale;
            }
        },
        computed: {
            currentSubOrders() {
                const isCurrent = (endTime) => {
                    const obj = new Date(endTime);

                    if (!isValidDate(obj)) {
                        console.warn('Totals: date parse error');
                        return false;
                    }

                    const today = new Date();

                    return obj.getDate() === today.getDate()
                        && obj.getMonth() === today.getMonth()
                        && obj.getYear() === today.getYear();
                };

                return this.$store.getters.subOrders.filter(i => isCurrent(i.end_time));
            },
            coin() {
                const filterByCoin = this.currentSubOrders.filter(i => i.paid === 'coin');
                return filterByCoin.reduce((acc, item) => {
                    acc += this.getBill(item);
                    return acc;
                }, 0);
            },
            card() {
                const filterByCard = this.currentSubOrders.filter(i => i.paid === 'card');
                return filterByCard.reduce((acc, item) => {
                    acc += this.getBill(item);
                    return acc;
                }, 0);
            },
            total() {
                return this.coin + this.card;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .totals {
        table {
            width: 100%;
        }

        td {
            padding: 5px 10px;
        }
    }
</style>