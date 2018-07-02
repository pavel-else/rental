<template>
    <div class="customer">
        <table class="customer__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Скидка</th>
            </tr>
            <tr v-for="C in customers" @click="onClick(C)">
                <td>{{ C.id_rent }}</td>
                <td>{{ C.fname }} {{ C.sname }} {{ C.tname }}</td>
                <td>{{ C.phone }}</td>
                <td>{{ C.sale }}</td>
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
                console.log('close')
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