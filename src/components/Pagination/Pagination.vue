<template>
    <div class="totals">
        Pagination
        <div v-for="i in list" :key="i">
            <slot name="item"></slot>
        </div>        
    </div>
</template>
<script>
    export default {
        props: {
            list: [Array, Object],
        }
    };
</script>
<style lang="scss">

</style>