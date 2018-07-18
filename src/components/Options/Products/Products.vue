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
            <tr v-for="product in products" @click="onClick(product)">
                <td>{{ product.id_rent }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.cost }}</td>
                <td>{{ product.tariff_id }}</td>
                <td>{{ product.active }}</td>
                <td>{{ product.updated }}</td>
            </tr>
        </table>

        <Details :data="product" @close="onClose" v-if="show"></Details>
    </div>
</template>
<script>
    import Details from './Details'
    export default {
        components: {
            Details
        },
        data() {
            return {
                show: false,
                product: null
            }
        },
        methods: {
            onClick(product) {
                console.log(product)
                this.product = product
                this.show = true
            },

            onClose() {
                this.product = {}
                this.show = false
            }

        },
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