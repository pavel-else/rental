<template>
    <div class="option option-tariffs">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Стоимость</th>
                <th>Тариф</th>
                <th>Статус</th>
                <th>Изменено</th>
            </tr>
            <tr v-for="product in products">
                <td>{{ product.id_rent }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.cost }}</td>
                <td>{{ product.tariff_id }}</td>
                <td>{{ product.active }}</td>
                <td>{{ product.updated }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        computed: {
            products() {
                return this.$store.getters.products
            }
        }
        
    }
</script>
<style scoped>
    td, th {
        padding-left: 10px;
    }
</style>