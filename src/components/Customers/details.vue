<template>
    <div class="details">
        <h3>
            <span v-if="customer.id">Сведения о клиенте</span>
            <span v-else>Добавить нового клиента</span>
        </h3>
        <form @click="onChange">
            <table>
                <tr v-if="customer.id">
                    <td>id</td>
                    <td><input type="text" v-model="C.id_rent" disabled> </td>
                </tr>
                <tr>
                    <td>Фамилия</td>
                    <td>
                        <input type="text" v-model="C.fname" placeholder="Фамилия">
                    </td>
                </tr>
                <tr>
                    <td>Имя</td>
                    <td>
                        <input type="text" v-model="C.sname" placeholder="Имя">
                    </td>
                </tr>
                <tr>
                    <td>Отчество</td>
                    <td>
                        <input type="text" v-model="C.tname" placeholder="Отчество">
                    </td>
                </tr>
                <tr>
                    <td>Телефон</td>
                    <td><input type="text" v-model="C.phone" placeholder="Номер мобильного телефона"></td>
                </tr>
                <tr>
                    <td>Паспорт</td>
                    <td><input type="text" v-model="C.passport" placeholder="Серия и номер паспорта"></td>                
                </tr>
                <tr>
                    <td>Адрес</td>                
                    <td><input type="text" v-model="C.address" placeholder="Адрес"></td>
                </tr>
                <tr>
                    <td>Дата рождения</td>                
                    <td><input type="text" v-model="C.birth_date" placeholder="Дата рождения"></td>
                </tr>
                <tr>
                    <td>Скидка</td>                
                    <td><input type="text" v-model="C.sale" placeholder="Скидка, %"></td>
                </tr>
                <tr>
                    <td>Баланс</td>                
                    <td><input type="text" v-model="C.balance" placeholder="Текущий баланс, руб"></td>
                </tr>
                <tr>
                    <td>Примечание</td>                
                    <td><textarea name="" id="" cols="30" rows="10" v-model="customer.note" placeholder="Дополнительные сведения о клиенте"></textarea></td>
                </tr>
            </table>    
        </form>
            <button @click="save" :disabled="!change">Сохранить</button>
            <button @click="close">Отмена</button>           
        
        <div class="details__close" @click="close"></div>    
    </div>
</template>

<script>
    export default {
        props: {
            customer: Object,
        },
        data() {
            return {
                C: Object.assign({}, this.customer),
                change: false
            }
        },
        methods: {
            save() {
                this.$store.dispatch('send', {
                    cmd: 'setCustomer',
                    value: this.C
                })

                this.close()
            },
            close() {
                this.$emit('close')
            },

            onChange() {
                this.change = true,
                console.log('change')
            },
        },
    }
</script>

<style scoped>
    .details {
        position: fixed;
        top: 100px;
        left: calc(50% - 150px);
        min-width: 300px;
        padding: 5px 10px;

        border: 1px solid lightgray;
        background-color: #fff;
        box-shadow: 0 2px 5px 0px;  
    }
    td {
        padding: 5px;
    }

    td:first-child {
        padding-right: 10px;
    }
    .details li {
        display: block;
        margin: 0;
    }
    .details__bill td {
        padding-top:  20px;
        font-weight: bold;
    }

    .details__close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
    }
    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 9px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
    }
</style>