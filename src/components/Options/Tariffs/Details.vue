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
                    <td>Расчасовка</td>
                    <td>
                        <ul>
                            <li v-for="(h, index) in tariff.h">
                                <div class="h__caption">{{ index }} </div>
                                <div><input type="text" v-model="tariff.h[index]" class="h__input"> </div>
                            </li>
                        </ul>
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
    export default {
        props: {
            tariff: Object
        },
        data() {
            return {
                newTariff: {
                    id:     this.tariff.id,
                    name:   this.tariff.name,
                    type:   this.tariff.type,
                    h:      this.tariff.h,
                    min:    this.tariff.min,
                    max:    this.tariff.max,
                    note:   this.tariff.note
                }
            }
        },
        methods: {
            save() {

            },
            close() {
                this.$emit('close')
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