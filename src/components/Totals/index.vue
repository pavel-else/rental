<template>
    <div class="totals">
        <h2>Итоги дня</h2>
        <table>
            <tr>
                <td>Наличные: </td>
                <td>{{ coin }} руб.</td>
            </tr>
            <tr>
                <td>По карте:</td>
                <td>{{ card }} руб.</td>
            </tr>
            <tr>
                <td><b>Итого за день: </b></td>
                <td><b>{{ total }} руб.</b></td>
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
                console.log(subOrder)
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

        td {
            padding: 5px 10px;
        }
    }
</style>