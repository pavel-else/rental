<template>
    <div class="snippet snippet__products">
        <h3>Свободные</h3>
        <table class="table table-bordered">
            <tr>
                <th>№</th>
                <th>Товар</th>
            </tr>
            <tr v-for="(item, index) in products" @click="toEdit(item)">
                <td>{{ index + 1}}</td>
                <td>{{ item.name }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'productList',

        props: {
            products: Array,
        },

        methods: {
            toEdit(item, index) {
                this.$emit("edit", item);
            }
        },
        computed: {
            
        }
    }
</script>

<style scoped>
    table {
        
    }
</style>