<template>
    <div class="snippet snippet__products">
        <h3>Свободныe</h3>
        <table class="table table-bordered">
            <tr>
                <th>№</th>
                <th>Товар</th>
            </tr>
            <tr v-for="(item, index) in filterProducts" @click="toEdit(item)" class="products__product">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        methods: {
            toEdit(item, index) {
                this.$store.dispatch('newOrder', item)
                this.$store.dispatch('showNewOrder', true)
            }
        },
        computed: {
            filterProducts() {
                const list = this.$store.getters.products

                return list ? list.filter(item => item.active != 0) : []
            },
        }

    }
</script>

<style scoped>
 .products__product:hover {
    cursor: pointer;
    outline: 1px solid rgba(0, 0, 0, 0.3);
 }
</style>