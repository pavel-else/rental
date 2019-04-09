<template>
    <div class="customer">
        <table class="customer__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Скидка</th>
                <th>Баланс</th>
            </tr>
            <tr v-for="customer in customers" :key="customer.id_rent" @click="onClick(customer)">
                <td>{{ customer.id_rent }}</td>
                <td>{{ customer.fname }} {{ customer.sname }} {{ customer.tname }}</td>
                <td ref="phone">{{ customer.phone }}</td>
                <td class="col--sale"><span v-if="customer && customer.sale > 0">{{ customer.sale }} %</span></td>
                <td class="col--balance"><span v-if="customer && customer.balance != 0">{{ customer.balance }} р</span></td>
            </tr>
        </table>
        <div class="customer_buttons">
            <button @click="addCustomer()">Добавить</button>
        </div>
        
        <Details :customer="customer" @close="onClose()" v-if="show"></Details>
        <button @click="setTo">Отправить обновленные данные</button>
    </div>
</template>

<script>
    import Details from './details';
    import Inputmask from 'inputmask';

    export default {
        components: {
            Details
        },
        beforeCreate() {
            this.$store.dispatch('getCustomers')
            .then(() => {
                this.preparePhone();
            });
        },
        updated() {
            this.preparePhone();
        },
        data() {
            return {
                customer: {},
                show: false
            }
        },
        methods: {
            onClick(customer) {
                this.customer = customer
                this.show = true
            },
            addCustomer() {
                this.show = true;
                this.customer = {};
            },
            onClose() {
                this.show = false
            },
            preparePhone() {
                const phone = new Inputmask("+7 (999) 999-99-99");
                phone.mask(this.$refs.phone);
            },
            setTo() {
                const customers = this.$store.getters.customers;

                const clear = (phone) => {
                    return phone.replace(/[^.\d]+/g, "");
                }

                const cmds = [];

                customers.map(i => {
                    i.phone = clear(i.phone);
                    cmds.push({ cmd: 'setCustomer', value: i });
                });

                this.$store.dispatch('multipleRequest', cmds);
            }
        },
        computed: {
            customers() {
                return this.$store.getters.customers
            }
        }
    }
</script>

<style>
    .customer {
        display: flex;
    }
    .customer_buttons {
        margin: 30px 20px;
    }
    .customer td {
        padding: 5px;
    }
    .customer__table tr:not(:first-child):hover {
        cursor: pointer;
        box-shadow: 0px 0px 1px 0px;
    }
    .col--sale,
    .col--balance {
        width: 50px;
        text-align: right;
    }
</style>