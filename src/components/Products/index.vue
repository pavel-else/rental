<template>
    <div class="option option-products">
        <template v-if="products.length">
            <table>
                <tr v-for="product in products" @click="onClick(product)">
                    <td class="product__td--status">
                        <span 
                            class="product__status" 
                            :class="'product__status--' + product.status"
                            :title="'Статус: ' + product.status" 
                        >                            
                        </span>
                    </td>

                    <td
                        @mousemove="openPhoto(product)"
                        @mouseout="closePhoto()"
                    >
                        <Bike :_color="product.color" :_type="+product.type"></Bike>
                    </td>

                    <td title="Название">{{ product.name }}</td>
                </tr>
            </table>            
        </template>
        <template v-else>Нет товаров</template>
        
        <button class="products__button products__button--add" @click="newProduct">Добавить</button>

        <Details :data="product" @close="onClose" v-if="showDetails"></Details>
        <Photo 
            class="photo"
            v-if="showPhoto"
            :product="product"
            :refresh="true"
        >
        </Photo>
    </div>
</template>

<script>
    import Details from './Details'
    import Bike    from '../Bike'
    import Photo   from '../Photo'
    export default {
        components: {
            Details,
            Bike,
            Photo
        },
        data() {
            return {
                showDetails: false,
                showPhoto: false,
                product: {}
            }
        },
        methods: {
            onClose() {
                this.product = {}
                this.showDetails = false
            },
            onClick(product) {
                this.product = product
                this.showDetails = true
                //console.log(product)
            },
            openPhoto(product) {
                this.product = product
                this.showPhoto = true
            },
            closePhoto(){
                this.showPhoto = false
                this.product = {}
            },

            newProduct() {
                this.show = true
                this.product = {
                    categories: null,
                    color:      "#fff",
                    cost:       0,
                    name:       '',
                    note:       null,
                    status:     'free',
                    tariff_default: null,
                    tariff_ids: null,
                    type: 1
                }
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

    tr:hover {
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
        margin-top: 10px;
        margin-left: 130px;
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
    .product__status--free {
    }
    .product__status--busy {
        background-color: #333;
        border: 1px solid lightgray;

    }
    .product__status--fix {
        border: 1px solid red;
    }

    .photo {
        position: absolute;
        margin-left: -180px;
        top: 200px;
        left: 50%;
        width: 480px;
        height: 320px;
    }

</style>