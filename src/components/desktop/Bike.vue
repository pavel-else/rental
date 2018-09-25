<template>
    <div class="icon">
        BIKE
    </div>
</template>

<script>
    export default {
        props: {
            bike: Object
        }
    }
</script>

<style scoped>
    .icon {
        display: block;
        width: 30px;
        height: 20px;
        background-image: url('http://overhost.net/rental2/api_v1/ajax/App/dist/bike.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: top;
    }
</style>