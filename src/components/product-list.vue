<template>
    <div class="snippet snippet__products">
        <h3>Свободныe</h3>
        <table class="table table-bordered">
            <tr>
                <th>№</th>
                <th>Товар</th>
            </tr>
            <tr v-for="(item, index) in filterProducts" @click="toEdit(item)">
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
            filterProducts() {
                const list = this.$store.getters.products

                return list.filter(item => item.active != 0)
            },
        }

    }
</script>

<style scoped>
</style>