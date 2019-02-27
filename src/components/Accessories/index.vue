<template>
    <div class="option option-accessories">
        <table>
            <tr>
                <th>id</th>
                <th>Название</th>
                <th>Значение</th>
                <th>Тип</th>
            </tr>
            <tr v-for="accessory in accessories" :key="accessory.id_rent" @click="onClick(accessory)">
                <td>{{ accessory.id_rent }}</td>
                <td>{{ accessory.name }}</td>
                <td>{{ accessory.value }}</td>
                <td>{{ accessory.type }}</td>
            </tr>
        </table>
        
        <button @click="newAccessory">Добавить</button>

        <Details :payload="accessory" @close="onClose" v-if="show"></Details>
    </div>
</template>
<script>
    import Details from './Details';
    import copy from '@/functions/copy';
    export default {
        components: {
            Details
        },
        beforeCreate() {
            this.$store.dispatch('getAccessories');
        },
        data() {
            return {
                show: false,
                accessory: {}
            }
        },
        methods: {
            onClose() {
                this.accessory = {}
                this.show = false
            },
            onClick(accessory) {
                this.accessory = copy(accessory);
                this.accessory.is_new = true;
                this.show = true;
            },
            newAccessory() {
                this.show = true;
                this.accessory = {};
                this.accessory.is_new = false;
                this.accessory.type = 'rub';
            }
        },
        computed: {
            accessories() {
                return this.$store.getters.accessories;
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