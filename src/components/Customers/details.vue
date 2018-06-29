<template>
    <div class="details">
        <h3>Сведения о клиенте</h3>
        <form @change="onChange">
            <table>
                <tr>
                    <td>id</td>
                    <td><input type="text" v-model="C.id_rent" disabled> </td>
                </tr>
                <tr>
                    <td>ФИО</td>
                    <td>
                        <input type="text" v-model="C.fname" >
                        <input type="text" v-model="C.sname">
                        <input type="text" v-model="C.tname">
                    </td>
                </tr>
                <tr>
                    <td>Телефон</td>
                    <td><input type="text" v-model="C.phone"></td>
                </tr>
                <tr>
                    <td>Паспорт</td>
                    <td><input type="text" v-model="C.passport"></td>                
                </tr>
                <tr>
                    <td>Адрес</td>                
                    <td><input type="text" v-model="C.address"></td>
                </tr>
                <tr>
                    <td>Дата рождения</td>                
                    <td><input type="text" v-model="C.birth_date"></td>
                </tr>
                <tr>
                    <td>Скидка</td>                
                    <td><input type="text" v-model="C.sale"></td>
                </tr>
                <tr>
                    <td>Баланс</td>                
                    <td><input type="text" v-model="C.balance"></td>
                </tr>
                <tr>
                    <td>Примечание</td>                
                    <td><textarea name="" id="" cols="30" rows="10" v-model="customer.note"></textarea></td>
                </tr>
            </table>    
            <button @click="save" :disabled="!change">Сохранить</button>
            <button @click="close">Отмена</button>           
        </form>
        
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
            save(e) {
                e.preventDefault(),

                console.log(this.C)
                this.$store.dispatch('send', {
                    cmd: 'setCustomer',
                    value: this.C
                })

                //this.close()
            },
            close(e) {
                e.preventDefault(),

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
        position: absolute;
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