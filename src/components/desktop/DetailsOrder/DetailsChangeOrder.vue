<<<<<<< HEAD
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
            <!-- <h3>Детали заказа<span> - #{{ order.order_id }}</span></h3> -->
=======
<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>Детали заказа<span> - #{{ order.order_id }}</span></h3>
>>>>>>> dev
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
                            <input class="add-order__input add-order__input--advance" v-model="order.advance" placeholder="0 руб" @input="status.changeOrder = true">
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
<<<<<<< HEAD
                            <SelectAccessories :data="accessories" :default="order.accessories" @setAccessories="setAccessories($event)"></SelectAccessories>
=======
                            <SelectAccessories :data="accessories" :default="subOrder.accessories" @setAccessories="setAccessories($event)"></SelectAccessories>
>>>>>>> dev
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
<<<<<<< HEAD
=======
                    <button @click="toPrint">Печать</button>
>>>>>>> dev
                    <button @click.prevent="save">Сохранить</button>
                    <button type="button" @click.prevent="close">Отмена</button>
                </div>
            </form>
<<<<<<< HEAD
=======

            <Print v-if="print" :order="order" @close="closePrint"></Print>
>>>>>>> dev
        </div>
    </div>
</template>

<script>
    import copyObject        from '../../../functions/copyObject'
    import getOrderId        from '../../../functions/getOrderId'
<<<<<<< HEAD
    import makeOrder         from '../../../functions/makeOrder'
=======
>>>>>>> dev

    import Position          from './idPosition/idPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'
<<<<<<< HEAD
=======
    import Print             from './Print'
>>>>>>> dev

    export default {
        props: {
            dataOrder: Object,
            dataSubOrder: Object
        },

        components: {
            Position,
            SelectCustomer,
            SelectAccessories,
            SelectTariff,
            SelectPromotion,
            SelectDeposit,
<<<<<<< HEAD
=======
            Print
>>>>>>> dev
        },
        data() {
            return {
                order:    {}, 
                subOrder: {},              
                product:  {},

                orders:    this.$store.getters.orders,
                subOrders: this.$store.getters.orderProducts,
                products:  this.$store.getters.products,

                status: {
                    changeOrder:    false,
                    changeSubOrder: false,
<<<<<<< HEAD
                },
=======
                    splitOrder:     false,
                },

                print: false,
>>>>>>> dev
            }
        },

        created() {
            this.order = this.dataOrder
            this.subOrder = this.dataSubOrder
            this.product = this.products.find(i => i.id_rent == this.dataSubOrder.product_id)
        },

        methods: {
            ...getOrderId,

            close() {
                this.$emit('close')
            },

            save() {

                // changeOrder
                if (this.status.changeOrder) {
                    console.log('changeOrder')
                    
                    this.$store.dispatch('send', [
                        {cmd: 'changeOrder', value: this.order},
                    ])
                }

                // changeProduct
<<<<<<< HEAD
                if (this.status.changeSubOrder) {
=======
                if (this.status.changeSubOrder && !this.status.splitOrder) {
>>>>>>> dev
                    console.log('ChangeSubOrder')
                    
                    this.$store.dispatch('send', [
                        {cmd: 'changeOrderProduct', value: this.subOrder},
                    ])
                }

<<<<<<< HEAD
            //     // splitProduct
            //     if (this.status == 'change' && this.statusPosition == 'new') {
            //         console.log('splitProduct')

            //         this.$store.dispatch('send', [
            //             {cmd: 'deleteOrderProduct', value: {
            //                 order_id:   this.dataOrder.order_id,
            //                 product_id: this.product.product_id
            //             }},
            //             {cmd: 'newOrder',        value: this.order},
            //             {cmd: 'addOrderProduct', value: this.product},
            //             {cmd: 'deleteOrder',     value: this.dataOrder},
            //         ])

            //     }

                // // newOrder
                // if (this.status.main == 'newOrder') {
                //     console.log('newOrder')

                //     this.$store.dispatch('send', [
                //         {cmd: 'newOrder',        value: this.order},
                //         {cmd: 'addOrderProduct', value: this.subOrder},
                //     ])

                //     this.$store.commit('setOption', {option: 'lastOrderTime', value: Date.now()})
                //     this.$store.commit('setOption', {option: 'lastOrderID', value: this.order.order_id})
                // }

                // // addSubOrder
                // if (this.status.main == 'addSubOrder') {
                //     console.log('addSubOrder')

                //     this.$store.dispatch('send', [
                //         {cmd: 'addOrderProduct', value: this.subOrder},
                //     ])
                // }
                
                this.close()
            },

            // isSerial() {
            //     const lastTime = this.$store.getters.options.lastOrderTime || false
            //     const interval = this.$store.getters.options.lastOrderInterval
            //     const now      = this.$store.getters.options.now
            //     const lastID   = this.getLastId()
            //     const order    = this.orders.find(i => i.order_id == lastID)

            //     // Если последний ордер уже закрыт
            //     if (!order || order.status == 'END') {
            //         return false
            //     }

            //     return lastTime && now - lastTime < interval
            // },

            // getLastId() {
            //     return this.$store.getters.options.lastOrderID
            // },
=======
                // splitOrder
                if (this.status.splitOrder) {
                    console.log('splitOrder')

                    this.$store.dispatch('send', [
                        {
                            cmd: 'splitOrder', 
                            value: {
                                order:    this.order,
                                subOrder: this.subOrder
                            }
                        }
                    ])

                }

              
                this.close()
            },
            toPrint() {
                this.print = true
            },
            closePrint() {
                this.print = false
            },
>>>>>>> dev

            getPosition() {
                // Если редактируем конкретный старый ордер, верну его позицию
                // Если ордер совсем новый, верну свободную позицию
                
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

                if (this.order.order_id_position) {
                    return this.order.order_id_position
                }
<<<<<<< HEAD

            },

            setPosition({order_id, order_id_position}) {
                this.order.order_id = order_id
                this.subOrder.order_id = order_id
                this.order.order_id_position = order_id_position
=======
            },

            splitOrder(order_id, position) {
                const order = this.order
                const subOrder = this.subOrder

                this.status.splitOrder = true

                order.old_id = this.order.order_id

                order.order_id = order_id
                order.start_time = Date.parse(this.order.start_time)
                order.order_id_position = position


                //subOrder.product_id = this.product.id_rent

                this.order = order
                this.subOrder = subOrder
            },

            setPosition({order_id, order_id_position}) {
                if (!this.orders.find(i => i.order_id == order_id)) {
                    this.status.splitOrder = true
                    this.splitOrder(order_id, order_id_position)
                }
>>>>>>> dev
            },
                
            setCustomer(customer) {
                this.order.customer_id = customer.id_rent 
                this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`

                this.status.changeOrder = true
            },

            setDeposit(deposit) {
                this.order.deposit = deposit.id_rent

                this.status.changeOrder = true
            },             

            setPromotion(promotion) {                 
                if (!promotion) {
                    return                 
                }

                this.order.promotion = promotion.id

                this.status.changeOrder = true
            },

            setAccessories(accessories) {
<<<<<<< HEAD
                this.order.accessories = accessories

                this.status.changeOrder = true
=======
                this.subOrder.accessories = accessories

                this.status.changeSubOrder = true
>>>>>>> dev
            },

            setTariff(tariff) {
                this.subOrder.tariff_id = tariff.id_rent
                this.status.changeSubOrder = true

                this.status.changeSubOrder = true
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
