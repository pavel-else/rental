<template>
    <div class="canvas">
        <div class="details details--repair">
            <h3>
                <span v-if="repair.isNew">Новый ремонт</span>
                <span v-if="!repair.isNew && !repair.end_time">Редактировать ремонт</span>
                <span v-if="!repair.isNew && repair.end_time">Детальная информация</span>
            </h3>            
            <table>
                <tr>
                    <td>Велосипед</td>
                    <td>{{ repair.product_name }}</td>
                </tr>
                <tr>
                    <td>Начало ремонта</td>
                    <td>
                        <span v-if="repair.end_time">{{ short(repair.start_time) }}</span>
                        <input v-else type="date" :min="startMin" :value="startMin">
                    </td>
                </tr>
                <tr v-if="repair.end_time">
                    <td>Конец ремонта</td>
                    <td>
                        <span v-if="repair.end_time">{{ short(repair.end_time, true) }}</span>
                    </td>
                </tr>
                <tr>
                    <td>Тип ремонта</td>
                    <td>
                        <span v-if="repair.end_time">{{ repair.crash_list }}</span>
                        <input v-else>
                    </td>
                </tr>
                <tr>
                    <td>Стоимость комплектующих</td>
                    <td>
                        <span v-if="repair.end_time">{{ repair.cost_comp }}р</span>
                        <input v-else v-model="repair.cost_comp">
                    </td>
                </tr>
                <tr>
                    <td>Стоимость всего ремонта</td>
                    <td>
                        <span v-if="repair.end_time">{{ repair.cost_repair }}р</span>
                        <input v-else v-model="repair.cost_repair">
                    </td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td>
                        <span v-if="repair.end_time">{{ repair.note }}</span>
                        <textarea v-else v-model="repair.note"></textarea>
                    </td>
                </tr>
            </table>

            <div class="btn-group" v-if="!repair.end_time">
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
    import shortDate from '@/functions/shortDate';

    export default {
        props: {
            payload: Object // Repair
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
            short(date) {
                return shortDate(date, 1);
            }
        },
        computed: {
            startMin() {
                return shortDate();
            }
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