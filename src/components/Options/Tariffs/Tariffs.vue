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
                <td>{{ tariff.id }}</td>
                <td>{{ tariff.name }}</td>
                <td>{{ tariff.type }}</td>
                <td>{{ getH(tariff.h) }}</td>
                <td>{{ tariff.min }}</td>
                <td>{{ tariff.max }}</td>
                <td>{{ tariff.note }}</td>
            </tr>
        </table>
        <Details :tariff="tariff" @save="setTariff($event)" @close="onClose" v-if="show"></Details>
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
            getH(h) {
                if (!h) return null
                if (Object.keys(h).length === 0) return null

                let result = ''

                for (let i in h) {
                    result = result + `${h[i]} `
                }

                return result
            },
            setTariff(tariff) {
                this.tariff = tariff
                
                console.log(tariff)

                this.$store.dispatch('send', {
                    cmd: 'setTariff',
                    value: this.tariff
                })
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
    td, th {
        padding: 10px;
    }
    th {
        text-align: left;
    }
    tr:hover {
        cursor: pointer;
        outline: 1px solid rgba(0,0,0,0.2);
    }
    
</style>