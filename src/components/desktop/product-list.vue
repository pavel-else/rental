<template>
    <div class="product-list">
        <h3>Свободныe</h3>
        <table class="table table-bordered">
            <tr
                v-for="(item, index) in filterProducts" 
                @click="onClick(item)" 
                class="products__product"
            >
                <td class="products__td">{{ item.name }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        methods: {
            onClick(item) {
                this.$emit('addOrder', item)
                //console.log(item)
            }
        },
        computed: {
            filterProducts() {
                const list = this.$store.getters.products

                return list ? list.filter(item => item.status == 'free') : []
            },
        }

    }
</script>

<style scoped>
    .products__td {
        padding: 0px 10px 5px;
    }
    .products__product:hover {
        cursor: pointer;
        outline: 1px solid #333;
    }
</style>