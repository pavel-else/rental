<template>
    <div class="canvas">
        <div class="details bikelist">
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
                    <td>{{ item.mileage > 0 ? item.mileage + ' ч': ''}}</td>
                    <td>{{ shortDate(item.last_repair_time) }}</td>
                </tr>
            </table>
            
            <div class="details__close" @click="close()"></div>
        </div>  
    </div>
</template>
<script>
    import * as Time from '@/functions/time';
    import copy from '@/functions/copy';
    export default {
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
                this.$emit('close');
            },
            shortDate(date) {
                // return date;
                return Time.format('DD MMMM YYYY', date);
            }
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
        }
    }
</script>
<style scoped>
    .details {
        display: flex;
        flex-direction: column;
        width: 570px;
        margin-top: 30px;
        overflow-y: hidden;
        margin-bottom: 100px;
    }
    .bikelist__caption {
        display: inline-flex;
    }
    .caption__clarification {
        font-size: 12px;
        padding: 5px 10px;
        margin-left: 10px;
        cursor: pointer;
    }
    .caption__clarification--select {
        outline: 1px solid lightgray;
    }

    .bikelist__table {
        margin-top: 30px;
    }
    .details td {
        padding: 5px 20px;
    }
    .details tr:first-child th {
        padding-bottom: 20px;
    }
    .details tr:not(:first-child):hover {
        cursor: pointer;
    }

    .sign--fix {
        display: block;
        width: 4px;
        height: 4px;
        border: 1px solid red;
        border-radius: 50%;
    }
</style>