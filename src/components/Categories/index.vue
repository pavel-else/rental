<template>
    <div class="option option-products">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Родительская<br>категория</th>
            </tr>
            <tr v-for="category in categories" :key="category.id_rent" @click="onClick(category)">
                <td>{{ category.id_rent }}</td>
                <td>{{ category.name }}</td>
                <td class="category__td category__td--parent">{{ category.parent }}</td>

            </tr>
        </table>
        
<!--         <button class="products__button products__button--add" @click="newProduct">Добавить</button> -->
<!-- 
        <Details :data="product" @close="onClose" v-if="show"></Details> -->
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
                console.log(product)
            },
            newProduct() {
                this.show = true
                this.product = {}
            }
        },
        computed: {
            categories() {
                return this.$store.getters.categories
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

    .category__td--parent{
        text-align: center;
    }

</style>