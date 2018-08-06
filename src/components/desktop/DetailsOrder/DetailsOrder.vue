<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>Детали заказа<span> - #{{ order.order_id }}</span></h3>

            <table>
                <tr>
                    <td>Товар</td>
                    <td>{{ product.name }}</td>
                </tr>
                <tr>
                    <td>ID заказа</td>
                    <td>
                        <Position :position="getPosition()" @setPosition="setPosition($event)"></Position>
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
                            :default="order.customer_id"
                            @setCustomer="setCustomer($event)" 
                        >
                        </SelectCustomer>
                    </td>
                </tr>
                <tr>
                    <td>Залог</td>
                    <td>
                        <SelectDeposit :data="deposits" :default="order.deposit" @setDeposit="setDeposit($event)"></SelectDeposit>
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
                        <SelectPromotion :data="promotions" :default="order.promotion" @setPromotion="setPromotion($event)"></SelectPromotion>
                    </td>
                </tr>
                <tr>
                    <td>Аксессуары</td>
                    <td>
                        <SelectAccessories :data="accessories" :default="order.accessories" @setAccessories="setAccessories($event)"></SelectAccessories>
                    </td>
                </tr>
                <tr>
                    <td>Тарифный план</td>
                    <td>
                        <SelectTariff 
                            :data-tariffs="tariffs" 
                            :data-tariff-default="product.tariff_id ? product.tariff_id : product.tariff_default" 
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
    import copyObject        from '../../../functions/copyObject'
    import getOrderId        from '../../../functions/getOrderId'

    import Position          from './IdPosition/IdPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'

    export default {
        props: {
            dataProduct: Object,
            dataOrder: Object
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
                order: this.copyObject(this.dataOrder),
                product: this.copyObject(this.dataProduct)
            }
        },
        methods: {
            ...copyObject,
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
                // Возвращает id текущей позиции ордера или новую позицию
               
                const orders = this.$store.getters.orders
                const count = 15
                let id = null

                const iter = (num) => {
                    id = orders.find(item => item.order_id_position == num) ? id : num

                    return num < 1 ? id : iter(num - 1)
                }

                return this.order.order_id_position ? +this.order.order_id_position : iter(count)
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
