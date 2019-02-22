<template>
    <div class="canvas">
        <div class="details details--repairs">
            <h3>
                <span>Выберете велосипед</span>
            </h3>
            <table>
                <tr>
                    <th>Нзвание</th>
                    <th>Пробег</th>
                    <th>Дата последнего ремонта</th>
                </tr>
                <tr v-for="item in products" :key="item.id_rent" @click="select(item)">
                    <td>{{ item.name }}</td>
                    <td>{{ item.mileage > 0 ? item.mileage + ' ч': ''}}</td>
                </tr>
            </table>
            
            <div class="details__close" @click="close()"></div>
        </div>  
    </div>
</template>
<script>
    import copy from '@/functions/copy';

    export default {
        methods: {
            close() {
                this.$emit('close');
            },
            select(item) {
                this.$emit('select', copy(item));
                this.$emit('close');
            }
        },
        computed: {
            products() {
                return this.$store.getters.products.filter(i => i.status === 'active');
            }
        }
    }
</script>
<style scoped>
    .details {
        width: 570px;
        margin-top: 30px;
        overflow-y: hidden;
        margin-bottom: 100px;
    }

    .details td {
        padding: 5px 20px;
    }
    .details tr:first-child th {
        padding-bottom: 20px;
    }
    .details tr:not(:first-child):hover {
        cursor: pointer;
    }
</style>