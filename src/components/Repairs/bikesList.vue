<template>
    <div class="bikelist">
        <div class="bikelist__caption">
            <h3>
                <span>Добавить в ремонт</span>
            </h3>
        </div>

        <input placeholder="Начните вводить название" @input="search()">

        <table class="bikelist__table" v-if="products && products.length > 0">
            <tr>
                <th>Название</th>
                <th>Пробег</th>
                <th>Дата последнего ремонта</th>
            </tr>
            <tr v-for="item in products.filter(filt)" :key="item.id_rent" @click="select(item)">
                <td>{{ item.name }}</td>
                <td style="text-align: right">{{ item.mileage | round }} ч.</td>
                <td>{{ item.last_repair_time | shortDate }}</td>
            </tr>
            <tr v-for="item in products.filter(filt)" :key="item.id_rent" @click="select(item)">
                <td>{{ item.name }}</td>
                <td style="text-align: right">{{ item.mileage | round }} ч.</td>
                <td>{{ item.last_repair_time | shortDate }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    import * as Time from '@/functions/time';
    import copy from '@/functions/copy';
    import Dialog from '@/components/Dialog';

    export default {
        components: {
            Dialog
        },
        data() {
            return {
                filt: i => i,
            }
        },
        methods: {
            search() {
                const text = event.target.value;

                this.filt = product => {
                    const name = product ? product.name : '';
                    return name.toUpperCase().indexOf(text.toUpperCase()) >= 0;
                };
            },
            close() {
                this.$emit('close');
            },
            select(item) {
                this.$emit('select', item);
            },
        },
        computed: {
            // выводит список продуктов с учетом их последнего ремонта
            products() {
                const getLastRepair = (product_id) => {
                    const repairs = copy(this.$store.getters.repairs);
                    const filter = repairs.filter(i => i.product_id == product_id && i.end_time);

                    const lastRepair = filter.reduce((acc, repair) => {
                        if (acc === null) {
                            acc = repair;
                        }

                        // Выбираем ремонт с наибольшим эндтайиом
                        if (Date.parse(repair.end_time) > Date.parse(acc.end_time)) {
                            acc = repair;
                        }

                        return acc;
                    }, null);

                    return lastRepair;
                };

                const products = copy(this.$store.getters.products);
                const notDeleted = products.filter(i => i.status !== 'deleted');

                return notDeleted.map(i => {
                    const lastRepair = getLastRepair(i.id_rent);
                    i.last_repair_time = lastRepair ? lastRepair.end_time : '';
                    return i;
                });
            }
        },
        filters: {
            round(mileage) {
                return mileage ? Math.round(mileage) : 0;
            },
            shortDate(date) {
                // return date;
                return Time.format('DD MMMM YYYY', date);
            },
        }
    };
</script>

<style lang="sass" scoped>

.bikelist
    max-width: 400px
    width: 100%
    display: flex
    flex-direction: column

    .bikelist__caption
        display: inline-flex


    .caption__clarification
        font-size: 12px
        padding: 5px 10px
        margin-left: 10px
        cursor: pointer

    .caption__clarification--select
        outline: 1px solid lightgray


    .bikelist__table
        border-collapse: collapse
        margin-top: 30px

        td
            padding: 2px 5px

        tr:hover td
            cursor: pointer
            background: #333


</style>