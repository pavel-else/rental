<template>

    <div class="customer__details">
        <h3>
            <span v-if="customer.id">Сведения о клиенте</span>
            <span v-else>Добавить нового клиента</span>
        </h3>
        <form @input="onChange">
            <table>
                <tr v-if="customer.id">
                    <td>id</td>
                    <td><input type="text" v-model="C.id_rent" disabled> </td>
                </tr>
                <tr>
                    <td>Фамилия</td>
                    <td>
                        <input type="text" v-model="C.fname" placeholder="Фамилия" ref="fname">
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
                    <td><input type="text" v-model="C.phone" placeholder="Номер мобильного телефона" ref="phone"></td>
                </tr>
                <tr>
                    <td>Паспорт</td>
                    <td><input type="text" v-model="C.passport" placeholder="Серия и номер паспорта" ref="pass"></td>
                </tr>
                <tr>
                    <td>Дата рождения</td>
                    <td><input type="date" v-model="C.birth_date" placeholder="Дата рождения"></td>
                </tr>
                <tr>
                    <td>Адрес</td>
                    <td><input type="text" v-model="C.address" placeholder="Адрес"></td>
                </tr>
                <tr>
                    <td class="customer_td--sale">Скидка, %</td>
                    <td><input type="text" v-model="C.sale" placeholder="Скидка, %"></td>
                </tr>
                <tr>
                    <td class="customer_td--balance">Баланс, р.</td>
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
    </div>

</template>

<script>
    import copy from '@/functions/copy';
    import Inputmask from 'inputmask';

    export default {
        props: {
            customer: Object,
        },
        mounted() {
            const makeInputMask = () => {
                const phone = new Inputmask("+7 (999) 999-99-99");
                phone.mask(this.$refs.phone);

                const pass = new Inputmask("9999 999999");
                pass.mask(this.$refs.pass);
            };

            makeInputMask();

            const setFocus = () => {
                if (!this.C.id_rent) {
                    this.$nextTick(() => this.$refs.fname.focus());
                }
            };

            setFocus();
        },
        data() {
            return {
                C: copy(this.customer),
                change: false
            }
        },
        methods: {
            save() {
                if (!this.C.fname) {
                    alert("Введите фамилию");

                    return false;
                }

                const preparePhone = (phone) => {
                    return phone.replace(/[^.\d]+/g, "");
                };

                this.C.phone = preparePhone(this.C.phone);

                this.$store.dispatch('multipleRequest', [
                    { cmd: 'setCustomer', value: this.C },
                    { cmd: 'getCustomers' }
                ]);
               
                this.close();
            },
            close() {
                this.$emit('close')
            },
            toDelete() {
                const id = this.C.id_rent;

                if (confirm(`Вы действительно хотите удалить клиента #${ id }?`)) {
                    this.$store.dispatch('multipleRequest', [
                        { cmd: 'deleteCustomer', value: id },
                        { cmd: 'getCustomers' }
                    ]);
                }
                
                this.close();
            },

            onChange() {
                this.change = true
            },
        },
    };
</script>

<style scoped>
    .details {
        min-width: 300px;
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

</style>