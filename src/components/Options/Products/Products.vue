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
            </tr>
            <tr v-for="product in products" @click="onClick(product)">
                <td>{{ product.id_rent }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.cost }}</td>
                <td>{{ product.tariff_ids }}</td>
                <td>{{ product.categories }}</td>
                <td class="product__td--status">
                    <span 
                        class="product__status" 
                        :class="'product__status--' + product.status"
                        :title="product.status" 
                    >                            
                    </span>
                </td>
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
        padding: 5px;
    }

    th {
        padding-bottom: 10px;
    }

    tr:not(:first-child):hover {
        cursor: pointer;
        outline: 1px solid #333;
    }

    .product__td--status {
        text-align: center;
    }

    .option-products {
        display: flex;
    }

    .products__button--add {
        align-self: flex-start;
        margin-top: 20px;
        margin-left: 30px;
    }

    .product__status {
        display: inline-block;
        width: 15px;
        height: 15px;
        box-sizing: border-box;
        border: 2px solid #333;
        border-radius: 50%;
        margin-right: 10px;
        vertical-align: middle;
    }
    .product__status--busy {
        background-color: lightgray;
    }
    .product__status--fix {
        border: 1px solid red;
    }

</style>