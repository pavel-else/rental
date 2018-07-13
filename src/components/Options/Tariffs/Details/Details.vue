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
                    <tr>
                        <td>Тип</td>
                        <td>
                            <input class="tariff__type" name="tariff__type" type="radio" id="tariff_type--h" value="hours" v-model="newTariff.type" :checked="newTariff.type == 'hours'">
                            <label for="tariff_type--h" class="tariff__type-label">Почасовой</label>

                            <input class="tariff__type" name="tariff__type" type="radio" id="tariff_type--f" value="fix" v-model="newTariff.type" :checked="newTariff.type == 'fix'">
                            <label for="tariff_type--f" class="tariff__type-label">Фиксированный</label>
                        </td>

                    </tr>
                    <tr v-if="newTariff.type == 'hours'">
                        <td>Расчасовка,<br>руб</td>
                        <td>
                            <table>
                                <tr v-for="(item, index) in newTariff.h">
                                    <td>
                                        {{ index + 1}}<span v-if="newTariff.h.length === index + 1">+</span> час
                                    </td>
                                    <td><input v-model="newTariff.h[index]"></td>
                                </tr>
                            </table>
                            <button @click="addH">+</button>
                            <button @click="rmH">-</button>
                        </td>
                    </tr>
                    <tr v-if="newTariff.type == 'fix'">
                        <td colspan="2">
                            <Tarification></Tarification>



<!--                                 <div><input type="checkbox">Повторять ежедневно</div>
                                <hr>

                                <div><input type="checkbox">Не учитывать время после завершения проката, с <input type="time" value="18:00"> до <input type="time" value="08:00"> </div> -->                      
                        </td>

                    </tr>
                    <tr>
                        <td>Мин</td>
                        <td><input v-model="newTariff.min"></td>
                    </tr>
                    <tr>
                        <td>Макс</td>
                        <td><input v-model="newTariff.max"></td>
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
                this.newTariff.h = this.newTariff.h ? this.newTariff.h.filter(h => {
                    if (h) return h
                }) : ''

                // Предобработка, расчасовки если тип поменялся
                this.newTariff.h = this.newTariff.type === 'hours' ? this.newTariff.h : null

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
                if (!this.newTariff.h) {
                    this.newTariff.h = []
                }

                this.newTariff.h.push('')
                this.change = true
            },
            rmH(e) {
                e.preventDefault()

                if (!this.newTariff.h) {
                    return
                }

                this.newTariff.h.pop()
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

    .tariff__type:checked + .tariff__type-label {
        outline: 1px solid red;
        opacity: 1;
    }

    .tariff__type-label {
        padding: 5px;
        opacity: 0.2;
    }
    .tariff__type-label:hover {
        cursor: pointer;
    }



</style>