<template>
    <div class="product-list">
        <h3>Свободныe <span v-if="products.length">({{ products.length }})</span></h3>
        <table class="table table-bordered">
            <tr
                v-for="(item, index) in products" 
                :key="item.id_rent"
                @click="onClick(item)" 
                class="products__product"
            >
                <td 
                    class="products__td products__td--icon" 
                    @mousemove="openPhoto(item)"
                    @mouseout="closePhoto()"
                >
                    <Bike :_color="item.color" :_type="+item.type"></Bike>
                </td>
                    
                <td class="products__td">{{ item.name }}</td>
            </tr>
        </table>

        <Photo :modal="modal" :_product="product"></Photo>
                    
    </div>
</template>

<script>
    import Bike   from '../Bike'
    import Photo  from '../Photo'
    import Resume from './Resume'

    export default {
        components: {
            Bike,
            Photo,
            Resume
        },

        data() {
            return {
                modal: false,
                product: null,
            }
        },
        methods: {
            onClick(item) {
                this.$emit('addOrder', item)
            },
            openPhoto(product) {
                this.modal = true
                this.product = product
            },
            closePhoto(){
                this.modal = false
            },
        },
        computed: {
            products() {
                const list = this.$store.getters.products

                return list ? list.filter(item => item.status == 'free') : []
            },
        },
    }
</script>

<style scoped>
    .products__td {
        padding: 0px 0px 10px 5px;
    }
    .products__product:hover {
        cursor: pointer;
        outline: 1px solid #333;
    }
</style>