<template>
    <div class="repairs">
        <table>
            <tr class="repairs__first-line">
                <th class="repairs__th">Название</th>
                <th class="repairs__th">Начало</th>
                <th class="repairs__th">Тип</th>
                <th class="repairs__th repairs__th--cost">Стоимость комплектующих</th>
                <th class="repairs__th repairs__th--cost">Стоимость всего ремонта</th>
                <th class="repairs__th">Примечание</th>
            </tr>
            <tr v-if="repairs && repairs.length < 1"><td colspan="6">В ремонте нет ни одного велосипеда</td></tr>
            <tr class="repairs__tr" v-for="item in repairs">
                <td class="repairs__td">{{ name(item) }}</td>
                <td class="repairs__td">{{ item.start_time }}</td>
                <td class="repairs__td">{{ item.types_fix }}</td>
                <td class="repairs__td repairs__td--cost">{{ item.cost_comp }}</td>
                <td class="repairs__td repairs__td--cost">{{ item.cost_repair }}</td>
                <td class="repairs__td">{{ item.note }}</td>
                <td class="repairs__td">{{ item.end_time }}</td>
            </tr>
        </table>

        <div class="repairs__buttons">
            <button>Добавить в ремонт</button>
        </div>
            
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    export default {
        beforeCreate() {
            this.$store.dispatch('GET_REPAIRS');
        },
        data() {
            return {}
        },
        methods: {
            name(item) {
                const product = this.$store.getters.products.find(i => i.id_rent === item.product_id);
                return product ? product.name : '';
            }
        },
        computed: {
            repairs() {
                return this.$store.getters.repairs;
            }
        }
    }
</script>
<style scoped>
    .repairs__first-line {

    }
    .repairs__th {
        padding: 0 5px;
        max-width: 150px;
    }

    .repairs__td {
        padding-top: 10px;
    }
    .repairs__th--cost,
    .repairs__td--cost {
        text-align: center;
    }

    .repairs__buttons {
        margin-top: 200px;
    }
</style>