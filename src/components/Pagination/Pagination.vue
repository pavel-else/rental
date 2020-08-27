<template>
    <div class="totals">
        Pagination
              <v-pagination
                v-model="page"
                class="my-4"
                :length="15"
              ></v-pagination>
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