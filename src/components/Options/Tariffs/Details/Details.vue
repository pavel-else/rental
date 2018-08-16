<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="tariff.id_rent">Редактирование тарифа</span>
                <span v-else>Новый тариф</span>
            </h3>
            <form @input="onChange">
                <table>
                    <tr>
                        <td>id</td>
                        <td><input :value="newTariff.id_rent" disabled></td>
                    </tr>
                    <tr>
                        <td>Название</td>
                        <td><input v-model="newTariff.name"></td>
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
                                v-model="newTariff.type" 
                                :checked="newTariff.type == 'h'"
                            >
                            <label for="tariff_type--h" class="tariff__type-label">Почасовой</label>

                            <input 
                                class="tariff__type" 
                                name="tariff__type" 
                                type="radio" 
                                id="tariff_type--f" 
                                value="f" 
                                v-model="newTariff.type" 
                                :checked="newTariff.type == 'f'"
                            >
                            <label for="tariff_type--f" class="tariff__type-label">Фиксированный</label>
                        
                            <input 
                                class="tariff__type" 
                                name="tariff__type" 
                                type="radio" 
                                id="tariff_type--d" 
                                value="d" 
                                v-model="newTariff.type" 
                                :checked="newTariff.type == 'd'"
                            >
                            <label for="tariff_type--d" class="tariff__type-label">Посуточный</label>
                        </td>

                    </tr>
                    <tr v-if="newTariff.type == 'h'">
                        <td>Расчасовка,<br>руб</td>
                        <td>
                            <table>
                                <tr v-for="(item, index) in newTariff._h_h">
                                    <td>
                                        {{ index + 1}}<span v-if="newTariff._h_h.length === index + 1">+</span> час
                                    </td>
                                    <td><input v-model="newTariff._h_h[index]"></td>
                                </tr>
                            </table>
                            <button @click="addH">+</button>
                            <button @click="rmH">-</button>
                        </td>
                    </tr>
                    <tr v-if="newTariff.type == 'h'">
                        <td>Мин</td>
                        <td><input v-model="newTariff._h_min"></td>
                    </tr>
                    <tr v-if="newTariff.type == 'h'">
                        <td>Макс</td>
                        <td><input v-model="newTariff._h_max"></td>
                    </tr>
                    <tr v-if="newTariff.type != 'h'">
                        <td>Стоимость</td>
                        <td><input v-model="newTariff.cost"></td>
                    </tr>
                        <td>Примечание</td>
                        <td><input v-model="newTariff.note"></td>
                    </tr>
                </table>
            </form>     
            
            <div class="btn-group">
                <button @click="save" :disabled="!change">Сохранить</button>
                <button @click="close">Отмена</button>
                <button @click="remove" v-if="tariff.id_rent">Удалить</button>      
            </div>

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    import Tarification from "./Tarification"
    export default {
        props: {
            tariff: Object
        },
        components: {
            Tarification
        },
        data() {
            return {
                // Не смог по-нормальному скопировать объект без геттеров, поэтому так
                newTariff: JSON.parse(JSON.stringify(this.tariff)),
                change: false
            }
        },
        methods: {
            save() {
                // Предобработка, удаление пустых полей
                this.newTariff._h_h = this.newTariff._h_h ? this.newTariff._h_h.filter(h => {
                    if (h) return h
                }) : ''

                // При переключении типа тарифa, некоторые поля следует отчищать
                this.newTariff._h_h = this.newTariff.type === 'h' ? this.newTariff._h_h : null
                this.newTariff.cost = this.newTariff.type === 'h' ? null : this.newTariff.cost
                this.newTariff._d_min = this.newTariff.type !== 'h' ? null : this.newTariff._d_min
                this.newTariff._d_max = this.newTariff.type !== 'h' ? null : this.newTariff._d_max

                console.log(this.newTariff)

                this.$store.dispatch('send', {
                    cmd: 'setTariff',
                    value: this.newTariff
                })

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
                if (confirm(`Вы действительно хотите удалить тариф '${this.newTariff.name}'?`)) {
                    this.$store.dispatch('send', {
                        cmd: 'deleteTariff',
                        value: this.newTariff.id_rent
                    })
                    this.$emit('close')
                }

            },
            addH(e) {
                e.preventDefault()

                // Если расчасовка пустая, подменим ее на пустой массив, чтобы пуш сработал
                if (!this.newTariff._h_h) {
                    this.newTariff._h_h = []
                }

                this.newTariff._h_h.push('')
                this.change = true
            },
            rmH(e) {
                e.preventDefault()

                if (!this.newTariff._h_h) {
                    return
                }

                this.newTariff._h_h.pop()
                this.change = true
            },
            onChange(e) {
                e.preventDefault()

                this.change = true

                console.log(this.newTariff)
            },
        },
    }
</script>

<style scoped>
    .details {
        width: 400px;
        margin-top: 120px;
    }
    input {
        width: 100%;
    }
    td {
        padding: 5px;
    }
    .h__caption {
        text-align: center;
    }
    .h__input {
        width: 35px;
        text-align: center;
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
        opacity: 0.2;
        font-size: 12px;
        font-weight: bold;
    }
    .tariff__type-label:hover {
        cursor: pointer;
    }



</style>