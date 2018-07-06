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
            <tr v-for="tariff in tariffs">
                <td>{{ tariff.id }}</td>
                <td>{{ tariff.name }}</td>
                <td>{{ tariff.type }}</td>
                <td>{{ h(tariff) }}</td>
                <td>{{ tariff.min }}</td>
                <td>{{ tariff.max }}</td>
                <td>{{ tariff.note }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        methods: {
            h(tariff) {
                const h = tariff.h

                if (Object.keys(h).length === 0) return

                let result = ''

                for (let i in h) {
                    result = result + `${h[i]} `
                }

                return result
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
    
</style>