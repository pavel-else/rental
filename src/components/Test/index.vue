<template>
    <v-dialog>
        <History />
    </v-dialog>
</template>0

<script>
    import vDialog from '@/components/Dialog'
    import products from '@/components/Products'
    import History from '@/components/History'

    export default {
        components: {
            vDialog,
            products,
            History,
        },
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>