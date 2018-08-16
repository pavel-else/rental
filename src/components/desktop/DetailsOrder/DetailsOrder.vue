<!-- 
    Компонент оперирует ордерами продуктов
    Данные в компонент могут приходить из 2 источников
    1. Новый ордер - product-list
    2. Существующий ордер - order-list

    Если новый ордер - то сам ордер пуст, передается только данные продукта.
    Если существующий - передается и ордер и продукт

    Данные обрабатываются и приводятся к общему виду в created

    Логическим завершением работы компонента есть отправка данных на сервер с нужной командой

    Команды:
    1. Новый ордер
    2. Добавить продукт к ордеру
    3. Изменить ордер
    4. Изменить продукт
    5. Отделить продукт в новый ордер
 -->

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
                        <td><input class="add-order__input add-order__input--advance" v-model="order.advance" placeholder="0 руб" @input="statusChangeOrder = true"></td>
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
<!--                     <button 
                        :disabled="!(status == 'new' && statusPosition == 'new')" 
                        @click="newOrder"
                    >
                        add Order + product
                    </button>
                    <button 
                        :disabled="!(status == 'new' && statusPosition == 'add')" 
                        @click="addProduct"
                    >
                        add Product to Order
                    </button>

                    <button 
                        :disabled="!(status == 'change' && statusChangeOrder)" 
                        @click="changeOrder"
                    >
                        change Order
                    </button>

                    <button 
                        :disabled="!(status == 'change' && statusChangeProduct)" 
                        @click="changeProduct"
                    >
                        change Product in Order
                    </button>

                    <button
                        :disabled="!(status == 'change' && statusPosition == 'new')" 
                        @click="splitProduct"
                    >
                        split product to new order
                    </button> -->


                    <button @click.prevent="save">save</button>
                    <button @click.prevent="close">Отмена</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import copyObject        from '../../../functions/copyObject'
    import getOrderId        from '../../../functions/getOrderId'
    import makeOrder         from '../../../functions/makeOrder'

    import Position          from './idPosition/idPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'

    export default {
        props: {
            dataOrder: null,
            dataProduct: null,
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
                order: null,
                product: null,

                status: null,
                statusPosition: null,
                statusChangeOrder: false,
                statusChangeProduct: false,

                cmd: null
            }
        },

        created() {
            const initOrder = (order) => {
                this.order = {
                    status:             order ? order.status : 'ACTIVE',
                    start_time:         order ? Date.parse(order.start_time) / 1000 : Math.floor(Date.now() / 1000),
                    order_id:           order ? order.order_id : this.getOrderId(),
                    order_id_position:  order ? order.order_id_position : null,
                    advance:            order ? order.advance : null,
                    note:               order ? order.note : null,
                    products:           order ? order.products : [],
                    promotion:          order ? order.promotion : null,
                    accessories:        order ? order.accessories : null,
                    customer_id:        order ? order.customer_id : null,
                    deposit:            order ? order.deposit : null, 
                }                
            }

            const initProduct = (product) => {
                this.product = {
                    name:         product.name,
                    order_id:     this.order.order_id,
                    product_id:   product.id_rent || product.product_id,
                    tariff_id:    product.tariff_default || product.tariff_id,
                    bill:         0,
                    bill_no_sale: 0,
                    end_time:     null                
                }                
            } 

            this.status = this.dataOrder ? 'change' : 'new'
            this.statusPosition = this.status == 'new' ? 'new' : 'add'
            
            initOrder(this.dataOrder)
            initProduct(this.dataProduct)
        },

        methods: {
            ...copyObject,
            ...getOrderId,
            ...makeOrder,

            close() {
                this.$emit('close')
            },
            save() {

                // newOrder
                if (this.status == 'new' && this.statusPosition == 'new') {
                    console.log('newOrder')

                    this.$store.dispatch('send', [
                        {cmd: 'newOrder',        value: this.order},
                        {cmd: 'addOrderProduct', value: this.product},
                    ])
                }

                // addProduct
                if (this.status == 'new' && this.statusPosition == 'add') {
                    console.log('addProduct')

                    this.$store.dispatch('send', [
                        {cmd: 'addOrderProduct', value: this.product},
                    ])
                }

                // changeOrder
                if (this.status == 'change' && this.statusChangeOrder) {
                    console.log('changeOrder')
                    
                    this.$store.dispatch('send', [
                        {cmd: 'changeOrder', value: this.order},
                    ])
                }

                // changeProduct
                if (this.status == 'change' && this.statusChangeProduct) {
                    console.log('changeProduct')
                    
                    this.$store.dispatch('send', [
                        {cmd: 'changeOrderProduct', value: this.product},
                    ])
                }

                // splitProduct
                if (this.status == 'change' && this.statusPosition == 'new') {
                    console.log('splitProduct')

                    this.$store.dispatch('send', [
                        {cmd: 'deleteOrderProduct', value: {
                            order_id:   this.dataOrder.order_id,
                            product_id: this.product.product_id
                        }},
                        {cmd: 'newOrder',        value: this.order},
                        {cmd: 'addOrderProduct', value: this.product},
                        {cmd: 'deleteOrder',     value: this.dataOrder},
                    ])
                }
                


                //this.$store.dispatch('sendQueue')

                this.close()
            },
            newOrder() {
                this.$store.dispatch('send', {
                    cmd: 'newOrder',
                    value: this.order
                })
                setTimeout(() => {
                    this.$store.dispatch('send', {
                        cmd: 'addOrderProduct',
                        value: this.product
                    })                    
                }, 500)

                this.close()
            },
            changeOrder() {
                this.$store.dispatch('send', {
                    cmd: 'changeOrder',
                    value: this.order
                })

                this.close()
            },

            addProduct() {
                this.$store.dispatch('send', {
                    cmd: 'addOrderProduct',
                    value: this.product
                })

                this.close()   
            },

            changeProduct() {
                this.$store.dispatch('send', {
                    cmd: 'changeOrderProduct',
                    value: this.product
                })

                this.close()
            },

            splitProduct() {
                //Удаляем из ордера
                const order_id = this.dataOrder.order_id
                const product_id = this.product.product_id
                const oldOrder = {order_id, product_id}

                setTimeout(() => {
                    this.$store.dispatch('send', {
                        cmd: 'deleteOrderProduct',
                        value: oldOrder
                    })                    
                }, 100)

                // Добавляем новый ордер
                setTimeout(() => {
                    this.$store.dispatch('send', {
                        cmd: 'newOrder',
                        value: this.order
                    })                  
                }, 200)

                //Записываем продукт в ордер
                setTimeout(() => {
                    this.$store.dispatch('send', {
                        cmd: 'addOrderProduct',
                        value: this.product
                    })                  
                }, 300)


                // Удаляем старый ордер
                setTimeout(() => {
                    this.$store.dispatch('send', {
                        cmd: 'deleteOrder',
                        value: this.dataOrder
                    })                    
                }, 400)

                this.close()
            },


            getPosition() {
                // Возвращает id текущей позиции ордера или новую позицию

                if (this.order.order_id_position) {
                    return this.order.order_id_position
                }
               
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
            },
            setPosition($event) {
                this.order.order_id_position = $event.order_id_position
                this.order.order_id = $event.order_id
                this.product.order_id = $event.order_id

                this.statusPosition = this.getOrderId() == this.order.order_id ?  'new' : 'add'
            },
                
            setCustomer(customer) {
                this.order.customer_id = customer.id_rent 
                this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`
                this.statusChangeOrder = true
            },

            setDeposit(deposit) {
                this.order.deposit = deposit.id_rent
                this.statusChangeOrder = true
            },             
            setPromotion(promotion) {                 if
(!promotion) {                     return                 }

                this.order.promotion = promotion.id
                this.statusChangeOrder = true
            },
            setAccessories(accessories) {
                this.order.accessories = accessories
                this.statusChangeOrder = true
            },
            setTariff(tariff) {
                this.product.tariff_id = tariff.id_rent
                this.statusChangeProduct = true
            },
        },

        computed: {
            customers() {
                return this.$store.getters.customers
            },
            tariffs() {
                const id = this.dataProduct.id_rent ||this.dataProduct.product_id

                const product = this.$store.getters.products.find(i => i.id_rent == id)

                const ids = product.tariff_ids.split(',')

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
