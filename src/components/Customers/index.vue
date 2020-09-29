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
                <td>{{ customer.formatPhone }}</td>
                <td class="col--sale"><span v-if="customer && customer.sale > 0">{{ customer.sale }} %</span></td>
                <td class="col--balance"><span v-if="customer && customer.balance != 0">{{ customer.balance }} р</span></td>
            </tr>
        </table>
        <div class="customer_buttons">
            <button @click="addCustomer()">Добавить</button>
        </div>

        <Dialog v-if="show" @close="onClose()">
            <Details :customer="customer" @close="onClose()" />
        </Dialog>

    </div>
</template>

<script>
    import Details from './details';
    import Dialog  from '@/components/Dialog';
    import copy from '@/functions/copy';

    export default {
        components: {
            Details,
            Dialog
        },
        beforeCreate() {
            this.$store.dispatch('getCustomers')
        },
        data() {
            return {
                customer: {},
                show: false
            }
        },
        methods: {
            onClick(customer) {
                this.customer = customer;
                this.show = true;
            },
            addCustomer() {
                this.show = true;
                this.customer = {};
            },
            onClose() {
                this.show = false;
            },
            preparePhone() {
                // const phone = new Inputmask("+7 (999) 999-99-99");
                // phone.mask(this.$refs.phone);
            },
        },
        computed: {
            customers() {
                const customers = copy(this.$store.getters.customers);
                console.log("CUST", customers);
                return customers.reduce((acc, item) => {

                    if (!item.phone || item.phone.length < 11) {
                        item.formatPhone = item.phone;
                        acc.push(item);
                        return acc;
                    }

                    const i = item.phone;

                    item.formatPhone = `+${i[0]} (${i[1]}${i[2]}${i[3]}) ${i[4]}${i[5]}${i[6]}-${i[7]}${i[8]}-${i[9]}${i[10]}`;

                    acc.push(item);
                    return acc;
                }, []);
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