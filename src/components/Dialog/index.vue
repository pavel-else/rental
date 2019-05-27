<template>
    <div class="dialog">
        <div class="background" @click="close()">
        </div>
        <div class="modal">
            <slot></slot>
            <div class="details__close" @click="close()"></div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            close() {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="sass" scoped>
.dialog 
    position: absolute
    top: 0
    left: 0
    width: 100vw
    display: flex
    justify-content: center
    margin-bottom: 100px


    .background 
        position: fixed
        top: 0
        left: 0
        width: 100vw
        min-height: 100vh
        padding-top: 50px
        display: flex
        justify-content: center
        align-items: flex-start
        background-color: rgba(0, 0, 0, .9)
        z-index: 100
    

    .modal 
        position: relative
        top: 50px
        min-width: 350px
        min-height: 120px
        padding: 10px 20px
        border: 1px solid #333
        z-index: 120
        background: #000
        box-shadow: 0 0 100px rgba(0,0,0,1)

</style>