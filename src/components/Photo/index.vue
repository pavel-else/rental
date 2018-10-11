<template>
        <div
            class="photo modal"
            :style="{backgroundImage: 'url(' + url + ')'}"
            :class="modalClassStyle"
        >
            {{ name }}
        </div>
</template>
<script>
    export default {
        props: {
            _product: Object,
            modal: Boolean
        },
        computed: {
            url() {
                const path = this.$store.getters.activePath
                const appID = this.$store.getters.appID 

                return this._product
                    ? `${ path }user_uploads/${ appID }_${ this._product.id_rent }` 
                    : null         
            },
            modalClassStyle() {
                return {
                    modal_active: this.modal, 
                    modal_deactive: !this.modal
                }
            },
            name() {
                return this._product ? this._product.name : 'no photo'
            }
        },
    }
    
</script>

<style scoped>
    .modal {
        opacity: 0;
        visibility: hidden;

        /*position: absolute;*/
        width: 360px;
        height: 240px;
        line-height: 240px;
        font-size: 18px;
        z-index: 50;
        background-color: #333;
        text-align: center;
        vertical-align: text-top;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        color: rgba(255, 255, 255, 0.5);
        border: 1px solid lightgray;
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