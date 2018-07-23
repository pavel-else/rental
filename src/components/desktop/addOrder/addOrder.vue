# asdfsdf
<template>
    <div class="canvas">
        <div class="details">
            <h3>Новый ордер<span> - #{{ order.order_id }}</span></h3>

            <table>
                <tr>
                    <td>Товар</td>
                    <td>{{ product.name }}</td>
                </tr>
                <tr>
                    <td>ID заказа</td>
                    <td><Position :free="freeId" @setPosition="setPosition($event)"></Position></td>
                </tr>
                <tr>
                    <td>Аванс</td>
                    <td><input type="text" v-model="order.advance" placeholder="0 руб"></td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>
                        <select @change="setClient" v-model="select.customer">
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
                    <td>Залог</td>
                    <td>
                        <select v-model="select.deposit" @change="setDeposit">
                            <option value="">Выбрать</option>
                            <option 
                                :value="deposit"
                                v-for="deposit in depositList"
                            >
                                {{ deposit }}
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td>
                        <textarea name="" id="" cols="30" rows="3" v-model="order.note"></textarea>
                    </td>
                </tr>
                <tr>
                    <td>Акция</td>
                    <td>
                        <select v-model="select.promotion" @change="setPromotion">
                            <option 
                                :value="promo"
                                v-for="promo in promotions"
                            >
                                {{ promo.name }}
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Аксессуары</td>
                    <td>
                        <select v-model="select.accessories" @change="setAccessories">
                            <option 
                                :value="item"

                                v-for="item in accessories"
                            >
                                {{ item.name }}
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Тарифный план</td>
                    <td>
                        <select v-model="select.tariff" @change="setTariff">
                            <option 
                                v-for="tariff in tariffs"
                                :value="tariff.id_rent"
                            >
                                {{ tariff.id_rent }}. {{ tariff.name }}
                            </option>
                        </select>
                    </td>
                </tr>
            </table>
                <div class="btn-group">
                    <button @click="save">Готово</button>
                    <button @click="close">Отмена</button>
                </div>
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
                    order_id_position: this.getFreeId(), // or setPosition($event) 
                    advance: null,
                    note: null,
                    promotion: null,
                    accessories: null       
                },

                select: {
                    customer: null,
                    deposit: null,
                    promotion: null,
                    accessories: null,
                    tariff: null
                },


                tariffs: this.product.tariff_id ? this.product.tariff_id.split(',').map(id => {
                    id = this.$store.getters.tariffs.find(tariff => tariff.id_rent === id)

                    return id
                }): []
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
                this.order.order_id_position = $event.order_id_position
                this.order.order_id = $event.order_id

                //console.log($event)
            },
            setDeposit() {
                this.order.deposit = this.select.deposit
            },
            setPromotion() {
                this.order.promotion = this.select.promotion.id
            },
            setAccessories() {
                this.order.accessories = this.select.accessories.id
                console.log(this.order)
            },
            setTariff() {
                this.order.tariff = this.select.tariff
            }
        },
        computed: {
            customers() {
                return this.$store.getters.customers
            },
            freeId() {
                return this.getFreeId()
            },
            depositList() {
                return this.$store.getters.depositList
            },
            promotions() {
                return this.$store.getters.promotions
            },
            accessories() {
                return this.$store.getters.accessories
            },
            // tariffs() {
            //     //need filter
            //     const products = this.$store.getters.products
            //     const product_id = this.order.products[0]
            //     const product = products.find(p => p.id_rent == product_id)
            //     const tariff_id_list = product.tariff_id.split(',')

            //     const tariffs = this.$store.getters.tariffsList

            //     const result = tariff_id_list.reduce((acc, item) => {
            //         acc.push(tariffs.find(t => t.id == item))
            //         return acc
            //     }, [])

            //     console.log(result)

            //     return result
            // }
        }

    }
</script>

<style>
    .btn-group {
        margin-top: 20px;
    }
</style>
