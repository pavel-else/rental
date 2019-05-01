<template>
    <div class="icon-wrap">
        <div class="icon" :class="iconClass">
            <div class="outline" v-show="select"></div>
            <div class="fill" v-show="!show"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            show: null,
            select: null
        },
        data() {
            return {
                
            }
        },
        computed: {
            iconClass() {
                return 'd' + this.id;
            }
        }
    }
</script>
<style scoped>
    .icon-wrap {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .icon {
        position: relative;
        width: 25px;
        height: 25px;
    }
    .outline {
        position: absolute;
        width: 100%;
        height: 100%;
        outline: 1px solid lightgray;
    }
    .fill {
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
    }

    .d0 {
        background-image: url('https://app.rentix.biz/images/star-green.svg');
    }
    .d1 {
        background-image: url('https://app.rentix.biz/images/star-yellow.svg');
    }
    .d2 {
        background-image: url('https://app.rentix.biz/images/star-purpur.svg');
    }
    .d3 {
        background-image: url('https://app.rentix.biz/images/star-red.svg');
    }

    .d4 {
        background-image: url('https://app.rentix.biz/images/circle-green.svg');
    }
    .d5 {
        background-image: url('https://app.rentix.biz/images/circle-yellow.svg');
    }
    .d6 {
        background-image: url('https://app.rentix.biz/images/circle-purpur.svg');
    }
    .d7 {
        background-image: url('https://app.rentix.biz/images/circle-red.svg');
    }

    .d8 {
        background-image: url('https://app.rentix.biz/images/triangle-green.svg');
    }
    .d9 {
        background-image: url('https://app.rentix.biz/images/triangle-yellow.svg');
    }
    .d10 {
        background-image: url('https://app.rentix.biz/images/triangle-purpur.svg');
    }
    .d11 {
        background-image: url('https://app.rentix.biz/images/triangle-red.svg');
    }

    .d12 {
        background-image: url('https://app.rentix.biz/images/rect-green.svg');
    }
    .d13 {
        background-image: url('https://app.rentix.biz/images/rect-yellow.svg');
    }
    .d14 {
        background-image: url('https://app.rentix.biz/images/rect-purpur.svg');
    }
    .d15 {
        background-image: url('https://app.rentix.biz/images/rect-red.svg');
    }
</style>