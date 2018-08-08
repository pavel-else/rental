<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>Новый ордер<span> - #{{ order.order_id }}</span></h3>

            <table>
                <tr>
                    <td>Товар</td>
                    <td>{{ product.name }}</td>
                </tr>
                <tr>
                    <td>ID заказа</td>
                    <td>
                        <Position :free="getPosition()" @setPosition="setPosition($event)"></Position>
                    </td>
                </tr>
                <tr>
                    <td>Аванс</td>
                    <td><input class="add-order__input add-order__input--advance" v-model="order.advance" placeholder="0 руб"></td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>
                        <SelectCustomer 
                            :data="customers"
                            @setCustomer="setCustomer($event)" 
                        >
                        </SelectCustomer>
                    </td>
                </tr>
                <tr>
                    <td>Залог</td>
                    <td>
                        <SelectDeposit :data="deposits" @setDeposit="setDeposit($event)"></SelectDeposit>
                    </td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td>
                        <textarea class="add-order__input--note" cols="30" rows="3" v-model="order.note"></textarea>
                    </td>
                </tr>
                <tr>
                    <td>Акция</td>
                    <td>
                        <SelectPromotion :data="promotions" @setPromotion="setPromotion($event)"></SelectPromotion>
                    </td>
                </tr>
                <tr>
                    <td>Аксессуары</td>
                    <td>
                        <SelectAccessories :data="accessories" @setAccessories="setAccessories($event)"></SelectAccessories>
                    </td>
                </tr>
                <tr>
                    <td>Тарифный план</td>
                    <td>
                        <SelectTariff 
                            :data-tariffs="tariffs" 
                            :data-tariff-default="product.tariff_default" 
                            @setTariff="setTariff($event)"
                        >
                        </SelectTariff>
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
    import getOrderId        from '../../../functions/getOrderId'
    import Position          from './IdPosition/IdPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'

    export default {
        props: {
            product: Object
        },
        components: {
            Position,
            SelectCustomer,
            SelectAccessories,
            SelectTariff,
            SelectPromotion,
            SelectDeposit,
        },
        data() {
            return {
                order: {
                    status: 'ACTIVE',

                    products: [
                        this.product.id_rent,
                    ],
                    start_time: Math.floor(Date.now() / 1000),

                    order_id: this.getOrderId(),

                    order_id_position: this.getPosition(), // or setPosition($event) 
                    advance: null,
                    note: null,
                    promotion: null,
                    accessories: null,
                    tariff: this.product.tariff_default,
                    customer: null     
                },
            }
        },
        methods: {
            ...getOrderId,

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
            setCustomer(customer) {
                this.order.customer_id = customer.id_rent
                this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`
            },
            getPosition() {
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
            },
            setDeposit(deposit) {
                this.order.deposit = deposit.id
            },
            setPromotion(promotion) {
                this.order.promotion = promotion.id
            },
            setAccessories(accessories) {
                this.order.accessories = accessories
            },
            setTariff(tariff) {
                this.order.tariff = tariff.id_rent
            },
        },

        computed: {
            customers() {
                return this.$store.getters.customers
            },

            tariffs() {
                if (!this.product.tariff_id) {
                    return []
                }

                const ids = this.product.tariff_id.split(',')

                return ids.map(id => {
                    return this.$store.getters.tariffs.find(tariff => tariff.id_rent === id)
                })
            },

            deposits() {
                return this.$store.getters.depositList
            },
            promotions() {
                return this.$store.getters.promotions
            },
            accessories() {
                return this.$store.getters.accessories
            },
        }
    }
</script>

<style>
    .add-order {
        width: 400px;
        margin-top: 80px;
        padding: 10px 20px;
    }

    .add-order td {
        padding: 5px 0;
    }
    .btn-group {
        margin-top: 20px;
    }
    .add-order__input {
        width: 300px;
        min-height: 40px;
        border-radius: 5px;
        border: 1px solid #e8e8e8;
    }
    .add-order__input--note {
        resize: vertical;
        width: 98%;
        border-radius: 5px;
        border-color: #e8e8e8;
    }
</style>
