<template>
<<<<<<< HEAD
    <div class="option option-tariffs">
=======
    <div class="option option-products">
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Стоимость</th>
                <th>Тариф</th>
<<<<<<< HEAD
                <th>Статус</th>
                <th>Изменено</th>
            </tr>
<<<<<<< HEAD
            <tr v-for="product in products" @click="onClick(product)">
=======
            <tr v-for="product in products">
>>>>>>> dev
=======
                <th>Категория</th>
                <th>Статус</th>
                <th>Изменено</th>
            </tr>
            <tr v-for="product in products" @click="onClick(product)">
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
                <td>{{ product.id_rent }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.cost }}</td>
                <td>{{ product.tariff_id }}</td>
<<<<<<< HEAD
=======
                <td>{{ product.categories }}</td>
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
                <td>{{ product.active }}</td>
                <td>{{ product.updated }}</td>
            </tr>
        </table>
<<<<<<< HEAD
<<<<<<< HEAD
=======
        
        <button class="products__button products__button--add" @click="newProduct">Добавить</button>
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3

        <Details :data="product" @close="onClose" v-if="show"></Details>
    </div>
</template>
<script>
<<<<<<< HEAD
    import Details from './Details'
=======
    import Details from './Details/Details'
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
    export default {
        components: {
            Details
        },
        data() {
            return {
                show: false,
<<<<<<< HEAD
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
=======
    </div>
</template>
<script>
    export default {
>>>>>>> dev
=======
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
>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
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
<<<<<<< HEAD
=======

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

>>>>>>> e06ed52976abfe125f2413a919a8c8650970a4b3
</style>