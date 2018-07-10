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
                        <td><input v-model="newTariff.type"></td>
                    </tr>
                    <tr v-if="newTariff.type == 'h'">
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

            <button @click="save" :disabled="!change">Сохранить</button>
            <button @click="close">Отмена</button>
            <button @click="remove" v-if="tariff.id_rent">Удалить</button>      

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            tariff: Object
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
                this.newTariff.h.push('')
            },
            rmH(e) {
                e.preventDefault()
                this.newTariff.h.pop()
            },
            onChange(e) {
                e.preventDefault()
                console.log('change')
                this.change = true
            }
        },
    }
</script>

<style scoped>
    .h__caption {
        text-align: center;
    }
    .h__input {
        width: 35px;
        text-align: center;
    }
</style>