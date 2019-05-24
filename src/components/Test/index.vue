<template>
    <v-dialog>
        <History />
    </v-dialog>
</template>0

<script>
    import vDialog from '@/components/Dialog'
    import products from '@/components/Products'
    import History from '@/components/History'
    import CreateCustomer from '@/components/Customers/details'

    export default {
        components: {
            vDialog,
            products,
            History,
            CreateCustomer
        },
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>