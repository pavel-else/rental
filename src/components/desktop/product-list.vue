<template>
    <div class="product-list">
        <h3>Свободныe <span v-if="filterProducts.length">({{ filterProducts.length }})</span></h3>
        <table class="table table-bordered">
            <tr
                v-for="(item, index) in filterProducts" 
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

        <div
            class="modal tmp"
            :class="modalClassStyle"
            :style="modalInlineStyle"
        >
            PHOTO
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
                modal: false
            }
        },
        methods: {
            onClick(item) {
                this.$emit('addOrder', item)
            },
            openPhoto(product) {
                this.modal = true
                console.log('call')
            },
            closePhoto(){
                this.modal = false
            }
        },
        computed: {
            filterProducts() {
                const list = this.$store.getters.products

                return list ? list.filter(item => item.status == 'free') : []
            },
            modalClassStyle() {
                return {
                    modal_active: this.modal, 
                    modal_deactive: !this.modal
                }
            },
            modalInlineStyle() {
                return {
                    backgroundImage: "url('http://overhost.net/rental2/api_v1/images/ava.jpg')",
                    backgroundSize: 'cover'
                }
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