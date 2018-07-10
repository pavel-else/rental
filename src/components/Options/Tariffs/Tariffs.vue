<template>
    <div class="option option-tariffs">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Расчасовка</th>
                <th>Мин</th>
                <th>Макс</th>
                <th>Примечание</th>
            </tr>
            <tr v-for="tariff in tariffs" @click="onClick(tariff)">
                <td>{{ tariff.id_rent }}</td>
                <td>{{ tariff.name }}</td>
                <td>{{ tariff.type }}</td>
                <td>{{ getHours(tariff.h) }}</td>
                <td>{{ tariff.min }}</td>
                <td>{{ tariff.max }}</td>
                <td>{{ tariff.note }}</td>
            </tr>
        </table>

        <button class="tariff__button tariff__button--add" @click="addTariff">Добавить</button>

        <Details :tariff="tariff"  @close="onClose" v-if="show"></Details>
    </div>
</template>
<script>
    import Details from './Details/Details'
    export default {
        components: {
            Details
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

                const hours = Object.values(h);

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
                    h: [0],
                    max: null,
                    min: null,
                    note: ''
                }
            }

        },
        computed: {
            tariffs() {
                return this.$store.getters.tariffsList
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
        outline: 1px solid rgba(0,0,0,0.2);
    }
    
</style>