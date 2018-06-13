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
                <td>id</td>
            </tr>
            <tr>
                <td>Клиент</td>
                <td>
                    <select name="" id="">
                        <option value="" v-for="customer in customers">{{ customer.fname }}</option>
                    </select>
                </td>
            </tr>
        </table>
        <div class="buttons">
            <button>OK</button>
            <button>cansel</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'newOrder',
        data() {
            return {
                a: 'asdfasdfasdf'
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
        left: calc(50% - 200px);
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