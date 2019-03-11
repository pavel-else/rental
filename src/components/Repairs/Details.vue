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
                        <span>{{ short(repair.start_time) }}</span>
                    </td>
                </tr>
                <tr v-if="repair.end_time">
                    <td>Конец ремонта</td>
                    <td>
                        <span v-if="repair.end_time">{{ short(repair.end_time) }}</span>
                    </td>
                </tr>
                <tr>
                    <td>Тип ремонта <span title="Обязательно к заполнению">*</span></td>
                    <td v-if="repair.isNew && !repair.isPlan">
                        <select v-model="repair.repair_type">
                            <option value="null" disabled>Выбрать</option>
                            <option v-for="item in planTypes" :value="item.id_rent" :key="item.id_rent">{{ item.name }}</option>
                            <option value="null" disabled>__________________________</option>
                            <option v-for="item in simpleTypes" :value="item.id_rent" :key="item.id_rent">{{ item.name }}</option>
                        </select>
                    </td>
                    <td v-else>
                        <span>{{ repair.repair_type_name }}</span>
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
                    <td>Стоимость работы</td>
                    <td>
                        <span v-if="repair.end_time">{{ repair.cost_work }}р</span>
                        <input v-else v-model="repair.cost_work">
                    </td>
                </tr>
                <tr>
                    <td>Примечание <span v-if="repair.repair_type === '0'" title="Обязательно к заполнению">*</span></td>
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
    import * as Time from '@/functions/Time';

    export default {
        props: {
            payload: Object, // Repair
        },
        data() {
            return {
                repair: copy(this.payload),
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            save() {
                if (this.isReady()) {
                    this.$store.dispatch('setRepair', this.repair);
                    this.$emit('close');
                } else {
                    alert('Укажите необходимые данные!');
                }
            },
            stop() {
                this.repair.end_time = new Date();
                this.$store.dispatch('stopRepair', this.repair);
                this.$emit('close');
            },
            short(date) {
                return Time.format('DD MMMM YYYY', date);
            },
            isReady() {
                if (!this.repair.repair_type) {
                    return false;
                }
                if (this.repair.repair_type === 'other' && !this.repair.note) {
                    return false;
                }
                return true;
            }
        },
        computed: {
            startMin() {
                return shortDate();
            },
            repairTypes() {
                const types = this.$store.getters.repairTypes;
                return types;
            },
            planTypes() {
                return this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '1') : [];
            },
            simpleTypes() {
                return this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '0') : [];
            },
        }
    }
</script>
<style scoped>
    .details {
/*        display: flex;
        flex-direction: column;
        align-items: stretch;*/
        width: 400px;
        margin-top: 30px;
        margin-bottom: 100px;
        overflow-y: hidden;
    }
    .details td {
        padding: 5px;
    }
    .details input,
    .details textarea,
    .details select {
        width: 100%;
        box-sizing: border-box;
    }
</style>