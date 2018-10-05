<template>
        <div
            class="photo modal"
            :style="{backgroundImage: 'url(' + url + ')'}"
            :class="modalClassStyle"
        >
            <span v-if="!url">NO PHOTO{{url}}</span>
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

                return this._product && this._product.img 
                    ? `${path}user_uploads/${appID}_${this._product.id_rent}_${this._product.img}` 
                    : null         
            },
            modalClassStyle() {
                return {
                    modal_active: this.modal, 
                    modal_deactive: !this.modal
                }
            },
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
/*        top: 200px;
        left: 50%;*/
        z-index: 50;
        /*margin-left: -180px;*/
        background-color: #000;
        text-align: center;
        vertical-align: middle;
        background-size: cover;
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