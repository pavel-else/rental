<template>
    <div class="canvas">
        <div class="details details--repair">
            <h3>
                <span v-if="repair.isNew">Новый ремонт</span>
                <span v-else>Редактировать ремонт</span>
            </h3>            
            <table>
                <tr>
                    <td>Велосипед</td>
                    <td>{{ repair.product_name }}</td>
                </tr>
                <tr>
                    <td>Начало ремонта</td>
                    <td>{{ repair.start_time }}</td>
                </tr>
                <tr>
                    <td>Тип ремонта</td>
                    <td><input></td>
                </tr>
                <tr>
                    <td>Стоимость комплектующих</td>
                    <td><input v-model="repair.cost_comp"></td>
                </tr>
                <tr>
                    <td>Стоимость всего ремонта</td>
                    <td><input v-model="repair.cost_repair"></td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td><textarea v-model="repair.note"></textarea></td>
                </tr>
            </table>

            <div class="btn-group">
                <button @click="save">Сохранить</button>
                <button @click="close">Отмена</button>
                <button v-if="!repair.isNew" @click="stop">Завершить</button>      
            </div>
            <div class="details__close" @click="close"></div>
        </div>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    // import timeFormat from '@/functions/timeFormat';

    export default {
        props: {
            payload: Object // Product
        },
        data() {
            return {
                repair: copy(this.payload)
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            save() {
                this.$emit('save', this.repair);
                this.$emit('close');
            },
            stop() {
                this.repair.end_time_timestamp = Date.now();
                this.$emit('stop', this.repair);
                this.$emit('close');
            },
        }
    }
</script>
<style scoped>
    .details {
        width: 400px;
        margin-top: 30px;
        margin-bottom: 100px;
        overflow-y: hidden;
    }
    .details td {
        padding: 5px;
    }
</style>