<template>
    <div class="canvas">
        <div class="details">
            <h3>Новый ордер</h3>

            <table>
                <tr>
                    <td>Товар</td>
                    <td>{{ product.name }}</td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>
                        <select name="" id="" @change="setClient" v-model="select.customer">
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
                <tr>
                    <td>ID</td>
                    <td><Position :free="freeId" @setPosition="setPosition($event)"></Position></td>
                </tr>
            </table>

                <button @click="save">Готово</button>
                <button @click="close">Отмена</button>
                <button @click="test">test</button>
        </div>
    </div>
</template>

<script>
    import Position from './idPosition'

    export default {
        props: {
            product: Object
        },
        components: {
            Position
        },
        data() {
            return {
                order: {
                    status: 'ACTIVE',

                    products: [
                        this.product.id_rent,
                    ], 
                    start_time: Math.floor(Date.now() / 1000),
                    order_id: this.$store.getters.options.new_order_id,
                    order_id_position: this.getFreeId() // or setPosition($event)             
                },

                select: {
                    customer: null,
                    order_id: null
                }
            }
        },
        methods: {
            close() {
                this.$emit('close')
            },
            save() {
                console.log(this.order)
                this.$store.dispatch('send', {
                    cmd: 'setOrder',
                    value: this.order
                })

                this.close()
            },
            setClient() {
                const client = this.select.customer

                this.order.customer_id = client.id_rent
                this.order.customer_name = `${client.fname} ${client.sname} ${client.tname}`

                console.log(this.order.customer_id)
            },
            getFreeId() {
                const orders = this.$store.getters.orders
                const count = 15
                let id = null

                const iter = (num) => {
                    id = orders.find(item => item.order_id_position == num) ? id : num

                    return num < 1 ? id : iter(num - 1)
                }

                return iter(count)
            },
            setPosition($event) {
                this.order.order_id_position = $event.position
                this.order.order_id = $event.order_id

                //console.log(this.order)
            },

            test() {
                console.log(this.select.order_id)
            }
        },
        computed: {
            customers() {
                return this.$store.getters.customers
            },
            freeId() {
                return this.getFreeId()
            }
        }

    }
</script>
