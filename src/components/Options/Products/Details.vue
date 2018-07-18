<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="product.id_rent">Редактирование товара</span>
                <span v-else>Новый товар</span>
            </h3>
            <table>
                <tr>
                    <td>id</td>
                    <td><input v-model="product.id_rent" disabled></td>
                </tr>
                <tr>
                    <td>Название</td>
                    <td><input v-model="product.name"></td>
                </tr>
                <tr>
                    <td>Стоимость</td>
                    <td><input v-model="product.cost"></td>
                </tr>
                <tr>
                    <td>Статус</td>
                    <td><input v-model="product.active"></td>
                </tr>
                <tr>
                    <td>Тарифный план</td>
                    <td><input v-model="product.tariff_id"></td>
                </tr>
            </table>

            <div class="btn-group">
                <button @click="save" :disabled="!change">Сохранить</button>
                <button @click="close">Отмена</button>
                <button @click="remove">Удалить</button>      
            </div>

            <div class="details__close" @click="close"></div> 
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Object
        },
        data() {
            return {
                change: false,
                product: this.data
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            save() {

            },
            remove() {
                
            }
        },
    }
</script>

<style scoped>
    .details {
        margin-top: 100px;
        width: 400px;
    }
</style>