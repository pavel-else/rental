<template>
    <div class="tariff_details">
        <h3>
            <span v-if="tariff.id_rent">Редактирование тарифа</span>
            <span v-else>Новый тариф</span>
        </h3>
        <form @input="onChange">
            <table>
                <tr>
                    <td>Название</td>
                    <td><input v-model="tariff.name"></td>
                </tr>
                <tr class="details__tr details__tr--type">
                    <td>Тип</td>
                    <td>
                        <input
                            class="tariff__type"
                            name="tariff__type"
                            type="radio"
                            id="tariff_type--h"
                            value="h"
                            v-model="tariff.type"
                            :checked="tariff.type == 'h'"
                        >
                        <label for="tariff_type--h" class="tariff__type-label">Почасовой</label>

                        <input
                            class="tariff__type"
                            name="tariff__type"
                            type="radio"
                            id="tariff_type--f"
                            value="f"
                            v-model="tariff.type"
                            :checked="tariff.type == 'f'"
                        >
                        <label for="tariff_type--f" class="tariff__type-label">Фиксированный</label>

                        <input
                            class="tariff__type"
                            name="tariff__type"
                            type="radio"
                            id="tariff_type--d"
                            value="d"
                            v-model="tariff.type"
                            :checked="tariff.type == 'd'"
                        >
                        <label for="tariff_type--d" class="tariff__type-label">Посуточный</label>
                    </td>

                </tr>
                <tr v-if="tariff.type == 'h'">
                    <td>Расчасовка,<br>руб</td>
                    <td>
                        <table>
                            <tr v-for="(item, index) in tariff._h_h" :key="index">
                                <td>
                                    {{ index + 1}}<span v-if="tariff._h_h.length === index + 1">+</span> час
                                </td>
                                <td><input v-model="tariff._h_h[index]"></td>
                            </tr>
                        </table>
                        <button @click="addH">+</button>
                        <button @click="rmH">-</button>
                    </td>
                </tr>
                <tr v-if="tariff.type == 'h'">
                    <td>Мин</td>
                    <td><input v-model="tariff._h_min"></td>
                </tr>
                <tr v-if="tariff.type == 'h'">
                    <td>Макс</td>
                    <td><input v-model="tariff._h_max"></td>
                </tr>
                <tr v-if="tariff.type === 'f'">
                    <td>Пробег<br><small>часов за весь период</small></td>
                    <td><input v-model="tariff.mileage"></td>
                </tr>
                <tr v-if="tariff.type != 'h'">
                    <td>Стоимость</td>
                    <td><input v-model="tariff.cost"></td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td><input v-model="tariff.note"></td>
                </tr>
            </table>
        </form>

        <div class="btn-group">
            <button @click="save" :disabled="!change">Сохранить</button>
            <button @click="close">Отмена</button>
            <button @click="remove" v-if="tariff.id_rent">Удалить</button>
        </div>

    </div>
</template>

<script>
    import copy from '@/functions/copy';
    export default {
        props: {
            _tariff: Object
        },
        data() {
            return {
                tariff: copy(this._tariff),
                change: false
            }
        },
        methods: {
            save() {
                // Предобработка, удаление пустых полей
                this.tariff._h_h = this.tariff._h_h ? this.tariff._h_h.filter(h => {
                    if (h) return h
                }) : ''

                // При переключении типа тарифa, некоторые поля следует отчищать
                this.tariff._h_h = this.tariff.type === 'h' ? this.tariff._h_h : null
                this.tariff.cost = this.tariff.type === 'h' ? null : this.tariff.cost
                this.tariff._d_min = this.tariff.type !== 'h' ? null : this.tariff._d_min
                this.tariff._d_max = this.tariff.type !== 'h' ? null : this.tariff._d_max


                this.$store.dispatch('setTariff', this.tariff);

                this.$emit('close')
            },
            close() {                
                if (!this.change) {
                    this.$emit('close')
                    return
                }

                if (confirm('Изменения не сохранены. Вы уверены, что хотите выйти?')) {
                    this.$emit('close')
                }
            },
            remove() {
                if (confirm(`Вы действительно хотите удалить тариф '${this.tariff.name}'?`)) {
                    this.$store.dispatch('deleteTariff', this.tariff.id_rent);
                    this.$emit('close');
                }

            },
            addH(e) {
                e.preventDefault()

                // Если расчасовка пустая, подменим ее на пустой массив, чтобы пуш сработал
                if (!this.tariff._h_h) {
                    this.tariff._h_h = []
                }

                this.tariff._h_h.push('')
                this.change = true
            },
            rmH(e) {
                e.preventDefault()

                if (!this.tariff._h_h) {
                    return
                }

                this.tariff._h_h.pop()
                this.change = true
            },
            onChange(e) {
                e.preventDefault();
                this.change = true;
            },
        },
    }
</script>

<style scoped>
    input {
        width: 100%;
    }
    td {
        padding: 5px;
    }
    .btn-group {
        margin-top: 20px;
    }

    .tariff__type {
        display: none;
    }

    .details__tr--type td {
        padding-bottom: 20px;
    }

    .tariff__type:checked + .tariff__type-label {
        outline: 1px solid red;
        opacity: 1;
    }

    .tariff__type-label {
        padding: 5px;
        opacity: 0.5;
        font-size: 12px;
        font-weight: bold;
    }
    .tariff__type-label:hover {
        cursor: pointer;
    }

</style>