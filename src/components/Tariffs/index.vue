<template>
    <div class="option option-tariffs">
        <table>
            <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Расчасовка</th>
                <th>Мин</th>
                <th>Макс</th>
                <th>Стоим.</th>
                <th>Примечание</th>
            </tr>
            <tr v-for="tariff in tariffs" :key="tariff.id_rent" @click="onClick(tariff)">
                <td>{{ tariff.name }}</td>
                <td>{{ getType(tariff) }}</td>
                <td>{{ getHours(tariff._h_h) }}</td>
                <td>{{ tariff._h_min }}</td>
                <td>{{ tariff._h_max }}</td>
                <td>{{ tariff.cost }}</td>
                <td>{{ tariff.note }}</td>
            </tr>
        </table>

        <button class="tariff__button tariff__button--add" @click="addTariff">Добавить</button>

        <Details :_tariff="tariff"  @close="onClose" v-if="show"></Details>
    </div>
</template>
<script>
    import Details from './Details/Details'
    export default {
        components: {
            Details
        },
        beforeCreate() {
            this.$store.dispatch('getTariffs');
        },
        data() {
            return {
                tariff: {},
                show: false
            }
        },
        methods: {
            onClick(tariff) {
                this.show = true
                this.tariff = tariff
            },
            onClose() {
                this.show = false
                this.tariff = {}
            },
            getHours(h) {
                if (!h) return null

                return h.reduce((acc, item) => {
                    return acc = acc + ` ${item}`   
                }, '')
            },
            addTariff() {
                //const id_rent = this.$store.getters.options.max_tariff_id + 1
                this.show = true

                // значения по умолчанию
                this.tariff = {
                    id_rent: null,
                    type: 'h',
                    name: '',
                    _h_h: [0],
                    _h_max: null,
                    _h_min: null,
                    _d_before: null,
                    _d_after: null,
                    cost: null,
                    mileage: 0,
                    note: ''
                }
            },
            getType(tariff) {
                if (!tariff || !tariff.type) {
                    return 'Нет типа тарифа';
                }
                switch(tariff.type) {
                    case 'h' : return 'Почасовой';
                    case 'd' : return 'Посуточный';
                    case 'f' : return 'Фиксированный';
                }
            }

        },
        computed: {
            tariffs() {
                return this.$store.getters.tariffs
            },
        }
        
    }
</script>
<style scoped>
    .option-tariffs {
        display: flex;
    }
    .tariff__button--add {
        align-self: flex-start;

        margin-top: 20px;
    }
    td, th {
        padding: 10px;
    }
    th {
        text-align: left;
    }
    tr:not(:first-child):hover {
        cursor: pointer;
        outline: 1px solid #333;
    }
    
</style>