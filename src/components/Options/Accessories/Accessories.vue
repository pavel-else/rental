<template>
    <div class="option option-accessories">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Значение</th>
                <th>Тип</th>
            </tr>
            <tr v-for="accessory in accessories" @click="onClick(accessory)">
                <td>{{ accessory.id_rent }}</td>
                <td>{{ accessory.name }}</td>
                <td>{{ accessory.value }}</td>
                <td>{{ accessory.type }}</td>
            </tr>
        </table>
        
<!--         <button class="products__button products__button--add" @click="newProduct">Добавить</button> -->
<!-- 
        <Details :data="product" @close="onClose" v-if="show"></Details> -->
    </div>
</template>
<script>
    //import Details from './Details/Details'
    export default {
        components: {
            //Details
        },
        data() {
            return {
                show: false,
                product: {}
            }
        },
        methods: {
            onClose() {
                this.product = {}
                this.show = false
            },
            // onClick(product) {
            //     this.product = product
            //     this.show = true
            //     console.log(product)
            // },
            // newProduct() {
            //     this.show = true
            //     this.product = {}
            // }
        },
        computed: {
            accessories() {
                return this.$store.getters.accessories
            }
        }
        
    }
</script>
<style scoped>
    td, th {
        padding: 10px 30px;
    }

    tr:not(:first-child):hover {
        cursor: pointer;
        outline: 1px solid #333;
    }
</style>