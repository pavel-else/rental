<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>Детали заказа<span> - #{{ order.order_id }}</span></h3>
            <form @submit.prevent="">
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
                        <td>
                            <input class="add-order__input add-order__input--advance" v-model="order.advance" placeholder="0 руб">
                        </td>
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
                            <textarea class="add-order__input add-order__input--note" cols="30" rows="3" v-model="order.note"></textarea>
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
                                v-if=""
                                :data-tariffs="tariffs" 
                                :data-tariff-default="subOrder.tariff_id ? subOrder.tariff_id : product.tariff_default" 
                                @setTariff="setTariff($event)"
                            >
                            </SelectTariff>
                        </td>
                    </tr>
                </table>
                <div class="btn-group">
                    <button @click.prevent="save">Сохранить</button>
                    <button type="button" @click.prevent="close">Отмена</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import getOrderId        from '../../../functions/getOrderId'

    import Position          from './idPosition/idPosition'
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
                order:    {
                    status:             null,              
                    start_time:         null,         
                    order_id:           null,           
                    order_id_position:  null,  
                    advance:            null,            
                    note:               null,               
                    products:           null,
                    promotion:          null,          
                    accessories:        null,        
                    customer_id:        null,        
                    deposit:            null,
                },

                subOrder: {
                    product_id:   null,
                    tariff_id:    null,
                    order_id:     null,
                    status:       null,
                    bill:         0,
                    bill_no_sale: 0,
                    pause_time:   0,
                },              

                orders:    this.$store.getters.orders,

                status: null
            }
        },

        created() {

            const newOrder = () => {
                this.order.status              = 'ACTIVE'
                this.order.start_time          = Date.now()
                this.order.order_id            = this.getOrderId('new')
                this.order.order_id_position   = this.getPosition('new')

                
                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.order_id
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0

                this.status = 'newOrder'
            }

            const addSubOrder = () => {

                this.order = this.orders.find(i => i.order_id == this.getLastId())

                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.order_id
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0

                this.status = 'addSubOrder'
            }

            this.isSerial() ? addSubOrder() : newOrder()   
        },

        methods: {
            ...getOrderId,

            close() {
                this.$emit('close')
            },

            save() {
                console.log('order: ',this.order, 'subOrder: ', this.subOrder)

                // newOrder
                if (this.status == 'newOrder') {
                    this.$store.dispatch('send', [
                        {cmd: 'newOrder',        value: this.order},
                        {cmd: 'addOrderProduct', value: this.subOrder},
                    ])

                    this.$store.commit('setOption', {option: 'lastOrderTime', value: Date.now()})
                    this.$store.commit('setOption', {option: 'lastOrderID', value: this.order.order_id})
                }

                // addSubOrder
                if (this.status == 'addSubOrder') {
                    console.log('addSubOrder')

                    this.$store.dispatch('send', [
                        {cmd: 'addOrderProduct', value: this.subOrder},
                    ])
                }

                this.close()
            },

            isSerial() {
                const lastTime = this.$store.getters.options.lastOrderTime || false
                const interval = this.$store.getters.options.lastOrderInterval
                const now      = this.$store.getters.options.now
                const lastID   = this.getLastId()
                const order    = this.orders.find(i => i.order_id == lastID)

                // Если последний ордер уже закрыт
                if (!order || order.status == 'END') {
                    return false
                }

                return lastTime && now - lastTime < interval
            },

            getLastId() {
                return this.$store.getters.options.lastOrderID
            },

            getPosition(cmd) {

                const newPosition = () => {
                    const orders = this.$store.getters.orders
                    const count = 15
                    let id = null

                    const iter = (num) => {
                        id = orders.find(item => item.order_id_position == num) ? id : num

                        return num < 1 ? id : iter(num - 1)
                    }

                    const result = iter(count)
                    this.order.order_id_position = result

                    return +result                    
                }

                if (cmd == 'new') {
                    return newPosition()
                }

                if (this.status == 'newOrder') {
                    return newPosition()
                }

                if (this.status == 'addSubOrder') {
                    return this.order.order_id_position
                }
            },

            setPosition({order_id, order_id_position}) {
                this.order.order_id = order_id
                this.subOrder.order_id = order_id
                this.order.order_id_position = order_id_position
            },
                
            setCustomer(customer) {
                this.order.customer_id = customer.id_rent 
                this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`
            },

            setDeposit(deposit) {
                this.order.deposit = deposit.id_rent
            },             

            setPromotion(promotion) {                 
                if (!promotion) {
                    return                 
                }

                this.order.promotion = promotion.id
            },

            setAccessories(accessories) {
                this.order.accessories = accessories
            },

            setTariff(tariff) {
                this.subOrder.tariff_id = tariff.id_rent
            },
        },

        computed: {
            customers() {
                return this.$store.getters.customers
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
            tariffs() {
                if (!this.product.id_rent) {
                    return
                }

                const id = this.product.id_rent
                const ids = this.product.tariff_ids.split(',')

                return ids.map(id => {
                    return this.$store.getters.tariffs.find(tariff => tariff.id_rent === id)
                })
            },
        },
    }
</script>

<style>
    .add-order {
        width: 400px;
        margin-top: 50px;
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
        box-sizing: border-box;
        border: 1px solid lightgray;
        padding-left: 10px;
    }

    .black .add-order__input--advance {
        background-color: #000;
        border: 1px solid #333;
        color: rgba(255, 255, 255, 0.8);
    }
    .white .add-order__input--advance {
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid lightgray;
    }

    .black .add-order__input--note {
        resize: vertical;
        width: 101%;
        background-color: #000;
        border-color: #333;
        color: rgba(255, 255, 255, 0.8);
        font-family: Roboto Condensed;

    }
    .white .add-order__input--note {
        resize: vertical;
        width: 98%;
        border-color: lightgray;
        color: #333;
        font-family: Roboto Condensed;
    }

    .black .multiselect {
        background-color: #000;
        border-radius: 0;
        border: 1px solid #333;
    }
    .white .multiselect {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 0;
        border: 1px solid lightgray;
    }  

    .black .multiselect__tags {
        background-color: #000;
        border: none;
        color: rgba(255, 255, 255, 0.8);
    }  
    .white .multiselect__tags {
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        color: #333;
    }
    .black .multiselect__single {
        background-color: #000;
    }
</style>
