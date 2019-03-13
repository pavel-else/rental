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
                <td>{{ customer.phone }}</td>
                <td><span v-if="customer && customer.sale > 0">{{ customer.sale }} %</span></td>
                <td><span v-if="customer && customer.balance > 0 || customers.balance < 0">{{ customer.balance }} р</span></td>
            </tr>
        </table>
        <div class="customer_buttons">
            <button @click="addCustomer">Добавить</button>
        </div>
        
        <Details :customer="customer" @close="onClose" v-if="show"></Details>
    </div>
</template>

<script>
    import Details from './details'

    export default {
        components: {
            Details
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
                this.show = true
                this.customer = {}
            },
            onClose() {
                this.show = false
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
</style>