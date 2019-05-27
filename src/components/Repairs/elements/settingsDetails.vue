<template>
    <div class="settings-details">
        <h3>
            <span v-if="repairType.isNew">Новый тип ремонта</span>
            <span v-else>Редактировать ремонт</span>
        </h3>

        <div class="errors" v-if="errors">
            <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
        </div>

        <table>
            <tr>
                <td>Название</td>
                <td><input type="text" v-model="repairType.name"></td>
            </tr>
            <tr>
                <td>Используется <br> в плановом ТО</td>
                <td><input type="checkbox" v-model="repairType.is_plan"></td>
            </tr>
            <tr v-if="repairType.is_plan">
                <td>Прериод <br> проведения ТО, часов</td>
                <td><input type="text" v-model="repairType.period"></td>
            </tr>
            <tr>
                <td>Примечание</td>
                <td><textarea v-model="repairType.note"></textarea></td>
            </tr>
        </table>


        <div class="btn-group">
            <button @click="save">Сохранить</button>
            <button @click="close">Отмена</button>
            <button v-if="!repairType.isNew" @click="remove">Удалить</button>
        </div>
    </div>
</template>

<script>
    import copy from '@/functions/copy';

    export default {
        props: {
            _repairType: Object,
        },
        data() {
            return {
                repairType: copy(this._repairType),
                errors: null,
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            save() {
                this.validate();

                if (!this.errors) {
                    this.$store.dispatch('setRepairType', this.repairType);
                    this.$emit('close');                    
                }
            },
            remove() {
                if (confirm('Хотите безвозвратно удалить этот тип ремонта?')) {
                    this.$store.dispatch('deleteRepairType', this.repairType.id_rent);
                    this.$emit('close');
                }
            },
            validate() {
                const errors = [];

                if (!this.repairType.name) {
                    errors.push('Укажите название типа');
                }

                if (this.repairType.name && this.repairType.name.length < 3) {
                    errors.push('Название должно иметь не менее 3 символов');
                }

                if (this.repairType.is_plan && !this.repairType.period) {
                    errors.push('Укажите период проведения ТО');
                }

                if (this.repairType.is_plan && this.repairType.period <= 0) {
                    errors.push('Период ТО быть положительным числом');
                }

                const pattern = /^\d+$/;

                if (this.repairType.is_plan && this.repairType.period && !pattern.test(this.repairType.period)) {
                    errors.push('Период ТО быть положительным числом');
                }

                this.errors = errors.length > 0 ? errors : null;
            },

            // stop() {
            //     this.repair.end_time = new Date();
            //     this.$store.dispatch('stopRepair', this.repair);
            //     this.$emit('close');
        },
        // computed: {
        //     startMin() {
        //         return shortDate();
        //     },
        //     repairTypes() {
        //         const types = this.$store.getters.repairTypes;
        //         return types;
        //     },
        //     planTypes() {
        //         return this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '1') : [];
        //     },
        //     simpleTypes() {
        //         const repairTypes = this.repairTypes ? this.repairTypes.filter(i => i.is_plan === '0') : [];
        //         const sorted = repairTypes.sort((a, b) => b.id_rent - a.id_rent);
                
        //         return sorted;
        //     },
        // }
    };
</script>

<style lang="scss" scoped>
    .settings-details {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 400px;
        margin-top: 30px;
        margin-bottom: 100px;
        overflow-y: hidden;

        input[type="text"],
        textarea {
            width: 100%;
            box-sizing: border-box;
        }

        .errors {
            background-color: #333;
            color: red;
            ul {
                display: flex;
                flex-direction: column;
            }
        }

        td {
            padding: 5px;
        }

        .btn-group {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
    }
</style>