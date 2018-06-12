<template>
    <div class="snippet snippet__products">
        <h3>Свободныe</h3>
        <table class="table table-bordered">
            <tr>
                <th>№</th>
                <th>Товар</th>
            </tr>
            <tr v-for="(item, index) in products" @click="toEdit(item)">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'productList',

        methods: {
            toEdit(item, index) {
                this.$emit("edit", item);
            }
        },
        computed: {
            products() {
                return this.$store.getters.products
            }
        }
    }
</script>

<style scoped>
</style>