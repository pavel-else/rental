<template>
    <div class="canvas">
        <div class="details customer__details">
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
                        <td><input type="date" v-model="C.birth_date" placeholder="Дата рождения"></td>
                    </tr>
                    <tr>
                        <td>Скидка, %</td>                
                        <td><input type="text" v-model="C.sale" placeholder="Скидка, %"></td>
                    </tr>
                    <tr>
                        <td>Баланс, р.</td>                
                        <td><input type="text" v-model="C.balance" placeholder="Текущий баланс, руб"></td>
                    </tr>
                    <tr>
                        <td>Примечание</td>                
                        <td><textarea name="" id="" cols="30" rows="10" v-model="C.note" placeholder="Дополнительные сведения о клиенте"></textarea></td>
                    </tr>
                </table>    
            </form>
            
            <button @click="save" :disabled="!change">Сохранить</button>
            <button @click="close">Отмена</button>           
            <button @click="toDelete" v-if="customer.id">Удалить</button>

            
            <div class="details__close" @click="close"></div>       
        </div>        
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
                if (!this.C.fname) {
                    alert("Введите фамилию")

                    return
                }

                this.$store.dispatch('send', {
                    cmd: 'setCustomer',
                    value: this.C
                })

               
                this.close()
            },
            close() {
                this.$emit('close')
            },
            toDelete() {
                const id = this.C.id_rent

                if (confirm(`Вы действительно хотите удалить клиента #${id}?`)) {
                    this.$store.dispatch('send', {
                        cmd: 'deleteCustomer',
                        value: id
                    })
                }
                
                this.close()                    
                // console.log(id)
                //deleteCustomer
            },

            onChange() {
                this.change = true
            },
        },
    }
</script>

<style scoped>
    .details {
        min-width: 300px;
        padding: 5px 10px;
        margin: 50px;
    }

    .customer__details input, 
    .customer__details textarea {
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid #333;
        box-sizing: border-box;
        width: 100%;
        padding: 5px 10px;
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