<template>
    <div class="canvas">
        <div class="details">
            <h3>Редактирование тарифа</h3>      
            <table>
                <tr>
                    <td>id</td>
                    <td><input type="text" :value="newTariff.id" disabled></td>
                </tr>
                <tr>
                    <td>Название</td>
                    <td><input type="text" v-model="newTariff.name"></td>
                </tr>
                <tr>
                    <td>Тип</td>
                    <td><input type="text" v-model="newTariff.type"></td>
                </tr>
                <tr v-if="newTariff.type == 'h'">
                    <td>Расчасовка,<br>руб</td>
                    <td>
                        <table>
                            <tr v-for="(item, index) in newTariff.h">
                                <td>{{ index + 1}}<span v-if="newTariff.h.length === index + 1">+</span> час</td>
                                <td><input v-model="newTariff.h[index]" ></td>
                            </tr>
                        </table>
                        <button @click="addH">+</button>
                        <button @click="rmH">-</button>
                    </td>
                </tr>
                <tr>
                    <td>Мин</td>
                    <td><input type="text" v-model="newTariff.min"></td>
                </tr>
                <tr>
                    <td>Макс</td>
                    <td><input type="text" v-model="newTariff.max"></td>
                </tr>
                    <td>Примечание</td>
                    <td><input type="text" v-model="newTariff.note"></td>
                </tr>
            </table>

            <button @click="save">Сохранить</button>
            <button @click="close">Отмена</button>           

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    import H from './h'
    export default {
        props: {
            tariff: null
        },
        components: {
            H
        },
        data() {
            return {
                newTariff: JSON.parse(JSON.stringify(this.tariff)) //Да, да, да... А как по-другому?!
            }
        },
        methods: {
            save() {
                const filter = this.newTariff.h.filter(h => {
                    if (h) return h
                })
                this.newTariff.h = filter

                this.$emit('save', this.newTariff)
                this.close()
            },
            close() {
                this.$emit('close')
            },
            addH() {
                this.newTariff.h.push('')
            },
            rmH() {
                this.newTariff.h.pop()
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