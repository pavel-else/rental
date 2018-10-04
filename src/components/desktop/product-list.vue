<template>
    <div class="product-list">
        <h3>Свободныe <span v-if="productsLength">({{ productsLength }})</span></h3>
        <table class="table table-bordered">
            <tr
                v-for="(item, index) in products" 
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
                <td>{{item.url_img }}</td>

                <td class="products__td">{{ item.name }}</td>
            </tr>
        </table>

        <div
            class="modal tmp"
            :class="modalClassStyle"
            :style="style"
        >
            PHOTO {{url_img}}
        </div>
                    
    </div>
</template>

<script>
    import Bike   from '../Bike'
    import Resume from './Resume'

    export default {
        components: {
            Bike,
            Resume
        },

        data() {
            return {
                modal: false,
                url_img: ''
            }
        },
        methods: {
            onClick(item) {
                this.$emit('addOrder', item)
            },
            openPhoto(product) {
                this.modal = true

                const path = this.$store.getters.activePath
                const appID = this.$store.getters.appID

                this.url_img = product.img ? `${path}user_uploads/${appID}_${product.id_rent}_${product.img}` : null
            },
            closePhoto(){
                this.modal = false
                this.url_img = ''
            },
        },
        computed: {
            products() {
                const list = this.$store.getters.products

                // return list ? list.filter(item => item.status == 'free') : []

                return list 
                    ? list.reduce((acc, item) => {
                        item.url_img = item.img 
                            ? `${this.$store.getters.appID}_${item.id_rent}_${item.img}` 
                            : null
                        acc[item.id_rent] = item
                        return acc
                    }, {})
                    : []
            },

            productsLength() {
                let count = 0
                for (let i in this.products) {
                    count++
                }
                    return count
            },

            modalClassStyle() {
                return {
                    modal_active: this.modal, 
                    modal_deactive: !this.modal
                }
            },
            style() {
                return this.url_img 
                    ? {backgroundImage: 'url(' + this.url_img + ')'}
                    : {backgroundImage: 'none'}
            }
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
    .modal {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        width: 360px;
        height: 240px;
        line-height: 240px;
        top: 200px;
        left: 50%;
        z-index: 50;
        margin-left: -180px;
        background-color: #000;
        text-align: center;
        vertical-align: middle;
        background-size: cover;
    }
    .modal_active {
        transition-property: visibility, opacity;
        transition-duration: 0s, 1s;
        opacity: 1;
        visibility: visible;
    }
    .modal_deactive {
        opacity: 0;
        visibility: hidden;
        transition-property: visibility, opacity;
        transition-duration: 0.5s, 0.5s;
    }
</style>