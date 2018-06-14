<template>
    <div class="new-order">
        <h2>Добавление нового ордера заказа</h2>
        <table>
            <tr>
                <td>Товар</td>
                <td>{{ product.name }}</td>
            </tr>
            <tr>
                <td>ID</td>
                <td><customer-id></customer-id></td>
            </tr>
            <tr>
                <td>Клиент</td>
                <td>
                    <select name="" id="" @change="selectClient" v-model="client">
                        <option value="">Выбрать</option>
                        <option 
                            v-for="customer in customers"
                            :value="customer" 
                        >
                            {{ customer.fname + ' ' + customer.sname  + ' ' + customer.tname }}
                        </option>
                    </select>
                </td>
            </tr>
        </table>
        <div class="buttons">
            <button @click="setOrder">OK</button>
            <button>cansel</button>
        </div>
    </div>
</template>

<script>
    import customerId from './customer-id'

    export default {
        components: {
            customerId,
        },
        name: 'newOrder',
        data() {
            return {
                client: 0
            }
        },
        methods: {
            selectClient(e) {
                //console.log(this.client)
                this.$store.dispatch('selectClient', this.client)
            },
            setOrder() {
                console.log(this.$store.getters.newOrder.order)
                this.$store.dispatch('send', {
                    cmd: 'setOrder',
                    value: this.$store.getters.newOrder.order
                })
            }
        },

        computed: {
            product() {
                return this.$store.getters.newOrder.product
            },
            customers() {
                return this.$store.getters.customers
            }
        }
    }
</script>

<style>
    .new-order {
        width: 400px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        position: absolute;
/*        left: calc(50% - 200px);*/
        top: 100px;
        background-color: #fff;
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 2px 1px 1px 10px 10px;

    }

    .new-order table {
        border: 1px solid lightgray;
    }

    .new-order td {
        border: 1px solid lightgray;
        padding: 5px;
    }

    .buttons {
        padding-top: 15px;
    }
</style>