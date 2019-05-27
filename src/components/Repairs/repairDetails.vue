<template>
    <div class="details-repairs">
        <h3>
            <span v-if="repair.isNew && repair.status !== 'task'">Добавить в ремонт</span>
            <span v-if="repair.isNew && repair.status === 'task'">Добавить в список задач</span>
            <span v-if="!repair.isNew">Детальная информация</span>
        </h3>
        <table>
            <tr>
                <td>Товар</td>
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
                <td>
                    <select v-model="repair.repair_type">
                        <option value="null" disabled>Выбрать</option>
                        <option v-for="item in planTypes" :value="item.id_rent" :key="item.id_rent">{{ item.name }}</option>
                        <option value="null" disabled>__________________________</option>
                        <option v-for="item in simpleTypes" :value="item.id_rent" :key="item.id_rent">{{ item.name }}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Стоимость комплектующих</td>
                <td>
                    <input v-model="repair.cost_comp">
                </td>
            </tr>
            <tr>
                <td>Стоимость работы</td>
                <td>
                    <input v-model="repair.cost_work">
                </td>
            </tr>
            <tr>
                <td>Примечание</td>
                <td>
                    <textarea v-model="repair.note"></textarea>
                </td>
            </tr>
        </table>

        <div class="btn-group">
            <button v-if="repair.status === 'task' && !repair.isNew" @click="addToRepairs()">Добавить в ремонт</button>
            <button @click="save()">Сохранить</button>
            <button @click="close()">Отмена</button>
            <button v-if="repair.status === 'active' && !repair.isNew" @click="stop()">Завершить ремонт</button>
            <button v-if="repair.status === 'task' && !repair.isNew" @click="deleteRepair()">Удалить</button>
        </div>
    </div>
</template>

<script>
    import Dialog from '@/components/Dialog';
    import copy from '@/functions/copy';
    import shortDate from '@/functions/shortDate';
    import * as Time from '@/functions/time';

    export default {
        components: {
            Dialog
        },
        props: {
            _repair: Object, // Repair
        },
        data() {
            return {
                repair: copy(this._repair),
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
            addToRepairs() {
                this.repair.status = 'active';
                this.save();
            },
            stop() {
                this.repair.end_time = new Date();
                this.repair.status = 'end';
                this.$store.dispatch('stopRepair', this.repair);
                this.$emit('close');
            },
            deleteRepair() {
                this.repair.status = 'delete';
                this.save();
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
                return types.filter(i => i.status === 'active');
            },
            planTypes() {
                return this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '1') : [];
            },
            simpleTypes() {
                const repairTypes = this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '0') : [];
                const sorted = repairTypes.sort((a, b) => b.id_rent - a.id_rent);

                return sorted;
            },
        }
    };
</script>

<style lang="scss" scoped>
    .details-repairs {
        width: 400px;

        td {
            padding: 5px;
        }

        & input,
        & textarea,
        & select {
            width: 100%;
            box-sizing: border-box;
        }

        .btn-group {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
    }
</style>