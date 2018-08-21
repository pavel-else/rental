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
                return 'd' + this.id
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
        background-color: rgba(256,256,256,0.8);
    }
    .white .fill {
        background-color: rgba(256,256,256,0.8);
    }
    .black .fill {
        background-color: rgba(0,0,0,0.75);
    }

    .d0 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/star-green.svg');
    }
    .d1 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/star-yellow.svg');
    }
    .d2 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/star-purpur.svg');
    }
    .d3 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/star-red.svg');
    }

    .d4 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/circle-green.svg');
    }
    .d5 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/circle-yellow.svg');
    }
    .d6 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/circle-purpur.svg');
    }
    .d7 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/circle-red.svg');
    }

    .d8 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/triangle-green.svg');
    }
    .d9 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/triangle-yellow.svg');
    }
    .d10 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/triangle-purpur.svg');
    }
    .d11 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/triangle-red.svg');
    }

    .d12 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/rect-green.svg');
    }
    .d13 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/rect-yellow.svg');
    }
    .d14 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/rect-purpur.svg');
    }
    .d15 {
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/rect-red.svg');
    }
</style>