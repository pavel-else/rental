<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>
                <span v-if="status === 'newOrder'">Новый заказ #{{ order.order_id }}</span>
                <span v-else>Добавить товар к заказу #{{ order.order_id }}</span>
            </h3>
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
                            <input 
                                class="add-order__input add-order__input--advance" 
                                v-model="order.advance" 
                                placeholder="0 руб"
                            >
                        </td>
                    </tr>
                    <tr>
                        <td class="customer">Клиент</td>
                        <td>
                            <SelectCustomer 
                                id="select_customer"
                                :customer="order.customer_id"
                                :focus="order.customer_id ? false : true"
                                @setCustomer="setCustomer($event)" 
                            >
                            </SelectCustomer>
                        </td>
                    </tr>
                    <tr>
                        <td>Залог</td>
                        <td>
                            <SelectDeposit 
                                :deposit="order.deposit" 
                                @setDeposit="setDeposit($event)"
                            >
                            </SelectDeposit>
                        </td>
                    </tr>
                    <tr>
                        <td>Примечание</td>
                        <td>
                            <textarea 
                                class="add-order__input add-order__input--note" 
                                cols="30" 
                                rows="3" 
                                v-model="order.note"
                            >
                            </textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Акция</td>
                        <td>
                            <SelectPromotion 
                                :promotion="order.promotion" 
                                @setPromotion="setPromotion($event)"
                            >
                            </SelectPromotion>
                        </td>
                    </tr>
                    <tr>
                        <td>Аксессуары</td>
                        <td>
                            <SelectAccessories 
                                :accessory="subOrder.accessories" 
                                @setAccessories="setAccessories($event)"
                            >
                            </SelectAccessories>
                        </td>
                    </tr>
                    <tr>
                        <td>Тарифный план</td>
                        <td>
                            <SelectTariff 
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
    import getSubOrderId     from '../../../functions/getSubOrderId'
    import copy        from '../../../functions/copy'

    import initOrder         from '../functions/initOrder'

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
                    customer_id:        null,        
                    deposit:            null,
                },

                subOrder: {
                    id_rent:      null,
                    order_id:     null,
                    product_id:   null,
                    tariff_id:    null,
                    accessories:  null,        
                    bill:         0,
                    bill_rent:    0,
                    bill_access:  0,
                    sale:         0,
                    paid:         false,
                    pause_start:  0,
                    pause_time:   0,
                    end_time:     null,
                    note:         null,
                    status:       null,
                },              

                status: null,
            }
        },

        created() {
            this.isSerial() ? 
                this.addSubOrder(this.getLastId()) : 
                this.newOrder()   
        },
        
        methods: {
            ...getOrderId,
            ...getSubOrderId,
            ...copy,

            close() {
                this.$emit('close')
            },

            save() {
                console.log('order: ',this.order, 'subOrder: ', this.subOrder)

                // newOrder
                if (this.status == 'newOrder') {

                    const options = {
                        lastOrderTime: Date.now(),
                        lastOrderID: this.order.order_id
                    }

                    this.$store.dispatch('send', [
                        {cmd: 'newOrder',        value: this.order},
                        {cmd: 'addOrderProduct', value: this.subOrder},
                        {cmd: 'setOptions',      value: options},
                    ])
                }

                // addSubOrder
                if (this.status == 'addSubOrder') {
                    console.log('addSubOrder')

                    this.$store.dispatch('send', [
                        {cmd: 'addOrderProduct', value: this.subOrder},
                        {cmd: 'changeOrder',     value: this.order},
                    ])
                }

                this.close()
            },

            newOrder(order_id_position) {
                this.order = initOrder()

                this.order.status              = 'ACTIVE'
                this.order.start_time          = Date.now() + this.registrationTime
                this.order.order_id            = this.getOrderId()
                this.order.order_id_position   = order_id_position || this.getPosition('new')

                this.$set(this.order, 'customer_id', null)
                
                this.subOrder.id_rent    = this.getSubOrderId()
                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.order_id
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0
                
                this.status = 'newOrder'
            },

            addSubOrder(order_id) {
                if (!order_id) {
                    console.log('empty order_id!')
                    return
                }

                const order = this.orders.find(i => i.order_id == order_id)

                if (!order) {
                    console.log('order not found!')
                }

                this.order = this.copy(order)

                this.subOrder.id_rent    = this.getSubOrderId()
                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.order_id
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0

                this.status = 'addSubOrder'
                console.log(this.subOrder)
            },

            isSerial() {
                const lastTime = this.$store.getters.options.lastOrderTime || false
                const interval = this.$store.getters.options.lastOrderInterval
                const now      = this.$store.getters.now
                const lastID   = this.getLastId()
                const order    = this.orders.find(i => i.order_id == lastID)

                // Если последний ордер уже закрыт
                if (!order || order.status === 'END' || order.status === 'DEL') {
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
                    // this.order.order_id_position = result

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
                this.orders.find(i => i.order_id == order_id)
                    ? this.addSubOrder(order_id)                    
                    : this.newOrder(order_id_position)
            },
                
            setCustomer(customer) {
                if (customer) {
                    this.order.customer_id = customer.id_rent 
                    this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`
                }
            },

            setDeposit(deposit) {
                if (deposit) {
                    this.order.deposit = deposit.id_rent
                }
            },             

            setPromotion(promotion) {                 
                if (promotion) {
                    this.order.promotion = promotion.id               
                }
            },

            setAccessories(accessories) {
                this.subOrder.accessories = accessories
            },

            setTariff(tariff) {
                this.subOrder.tariff_id = tariff.id_rent
            },
        },

        computed: {
            orders() {
                return this.$store.getters.orders
            },
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
            registrationTime() {
                return +this.$store.getters.options.registration_time
            }
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

    .customer::after {
        display: inline-block;
        content: '+';
        border: 1px solid #333;
        border-radius: 50%;
        font-size: 8px;
        width: 8px;
        height: 8px;
        line-height: 8px;
        padding: 0;
        margin-left: 8px;
        text-align: center;
        vertical-align: middle;
        color: #333;
    }
    .customer:hover {
        cursor: pointer;
    }
    .customer:hover::after{
        border-color: lightgray;
        color: lightgray;
    }
</style>
