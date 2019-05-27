<template>
    <div class="product-list">
        <h3>
            {{ activeCategoryName }}<span v-if="products.length >= 0"> ({{ products.length }})</span>
        </h3>
        <table class="table table-bordered">
            <tr
                v-for="item in products"
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

                <td class="products__td">
                    {{ item.name }}
                    <span v-if="item.size && item.category != 1">({{ item.size }})</span>
                </td>
            </tr>
        </table>

        <Photo
            class="products__photo"
            v-if="product.id_rent"
            :product="product"
        ></Photo>

    </div>
</template>

<script>
    import Bike   from '../Bike'
    import Photo  from '../Photo'

    export default {
        components: {
            Bike,
            Photo,
        },

        data() {
            return {
                modal: false,
                product: {},
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
            closePhoto() {
                this.modal = false
                this.product = {}
            },
        },
        computed: {
            // Возвращает список всех активных велосипедов, не находящихся в прокате
            // не выключенных из списка в настройках товара и не удаленных
            // и не находщихся в ремонте
            products() {
                const isRent = (productId) => {
                    const activeSubOrders = this.$store.getters.activeSubOrders;
                    return activeSubOrders.find(item => item.product_id == productId);
                };
                const isBroken = (productId) => {
                    const repairs = this.$store.getters.repairs;
                    const filter = repairs ? repairs.filter(i => i.product_id === productId) : [];
                    const result = filter.find(i => !i.end_time);
                    return !!result;
                };
                const belongsActiveCategory = (product) => {
                    const activeCategory = this.$store.getters.activeCategory;

                    return activeCategory ? activeCategory.id_rent == product.category : true;
                };

                const list = this.$store.getters.products;

                return list ? list.filter(item => {
                    return !isRent(item.id_rent)          // не находится в прокате
                        && item.status === 'active'     // не отключен в настройках товара и не удален
                        && !isBroken(item.id_rent)     // не находится в ремонте
                        && belongsActiveCategory(item) // и принадлежит активной категории
                }) : [];
            },
            activeCategoryName() {
                const activeCategory = this.$store.getters.activeCategory;
                return activeCategory ? activeCategory.name : 'Все';
            }
        },
    };
</script>

<style lang="sass" scoped>

.product-list
    padding: 10px
    
    .products__td 
        padding: 0px 0px 10px 5px
    
    .products__product:hover 
        cursor: pointer
        outline: 1px solid #333
    
    .products__photo 
        position: absolute
        margin-left: -180px
        top: 200px
        left: 50%
        width: 480px
        height: 320px
    
</style>