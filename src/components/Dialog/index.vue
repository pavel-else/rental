<template>
    <div class="dialog" v-if="show">
        <div class="background" @click="show = false">
        </div>
        <div class="modal">
            <slot></slot>
            <div class="details__close" @click="show = false"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                show: true
            }
        }
    }
</script>

<style lang="scss" scoped>
.dialog {
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        min-height: 100vh;
        padding-top: 50px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background-color: rgba(0, 0, 0, .5);
        z-index: 100;
    }

    .modal {
        position: relative;
        min-width: 350px;
        min-height: 120px;
        padding: 10px 20px;
        border: 1px solid #333;
        z-index: 120;

    }
    .miss {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: #0D7F8B;
        z-index: 110;
    }
}
</style>