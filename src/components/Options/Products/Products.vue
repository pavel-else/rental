<template>
    <div class="option option-products">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Стоимость</th>
                <th>Тариф</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Изменено</th>
            </tr>
            <tr v-for="product in products" @click="onClick(product)">
                <td>{{ product.id_rent }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.cost }}</td>
                <td>{{ product.tariff_ids }}</td>
                <td>{{ product.categories }}</td>
                <td>{{ product.status }}</td>
                <td>{{ product.updated }}</td>
            </tr>
        </table>
        
        <button class="products__button products__button--add" @click="newProduct">Добавить</button>

        <Details :data="product" @close="onClose" v-if="show"></Details>
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
                show: false,
                product: {}
            }
        },
        methods: {
            onClose() {
                this.product = {}
                this.show = false
            },
            onClick(product) {
                this.product = product
                this.show = true
                //console.log(product)
            },
            newProduct() {
                this.show = true
                this.product = {}
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

    tr:not(:first-child):hover {
        cursor: pointer;
        outline: 1px solid rgba(0,0,0,0.2);
    }

    .option-products {
        display: flex;
    }

    .products__button--add {
        align-self: flex-start;
        margin-top: 20px;
    }

</style>