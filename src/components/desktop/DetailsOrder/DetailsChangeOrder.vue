<template>
    <div class="canvas">
        <div class="add-order details">
            <h3>Детали заказа<span> - #{{ order.order_id }} / {{ subOrder.id_rent }}</span></h3>
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
                        <td>Статус</td>
                        <td>
                            {{ subOrder.status }}
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
                            <!-- <SelectCustomer2
                                :default="order.customer_id"
                                @setCustomer="setCustomer($event)"
                            >
                            </SelectCustomer2> -->
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
                            <SelectAccessories :data="accessories" :default="subOrder.accessories" @setAccessories="setAccessories($event)"></SelectAccessories>
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
                    <button class="change-order__button" @click="toPrint">
                        Печать
                    </button>

                    <button class="change-order__button" @click.prevent="save">
                        Сохранить                        
                    </button>

                    <button class="change-order__button" @click.prevent="abortSubOrder">
                        Удалить товар
                    </button>

                    <button class="change-order__button" @click.prevent="stop()">
                        Стоп
                    </button>

                    <button class="change-order__button" @click.prevent="pauseSubOrder()">
                        Пауза
                    </button>
                </div>

                <button class="details__close" @click.prevent="close"></button>
            </form>

            <Print v-if="print" :order="order" @close="closePrint"></Print>
            <Resume :_order="order" :_subOrder="subOrder" @close="closeResume" v-if="showResume"></Resume>
        </div>
    </div>
</template>

<script>
    import copyObject        from '../../../functions/copyObject'
    import getOrderId        from '../../../functions/getOrderId'

    import Position          from './idPosition/idPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectCustomer2    from './SelectCustomer2'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'
    import Print             from './Print'
    import stopSubOrder      from '../functions/stopSubOrder'
    import pause             from '../functions/pause'
    import Resume            from '../Resume'

    export default {
        props: {
            dataOrder: Object,
            dataSubOrder: Object
        },

        components: {
            Position,
            SelectCustomer,
            SelectCustomer2,
            SelectAccessories,
            SelectTariff,
            SelectPromotion,
            SelectDeposit,
            Print,
            Resume
        },

        data() {
            return {
                order:    {}, 
                subOrder: {},              
                product:  {},

                orders:    this.$store.getters.orders,
                products:  this.$store.getters.products,

                status: {
                    changeOrder:    false,
                    changeSubOrder: false,
                    splitOrder:     false,
                },

                print: false,
                showResume: false,
            }
        },

        created() {
            this.order = this.dataOrder
            this.subOrder = this.dataSubOrder
            this.product = this.products.find(i => i.id_rent == this.dataSubOrder.product_id)
        },

        methods: {
            ...getOrderId,
            ...stopSubOrder,

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
                if (this.status.changeSubOrder && !this.status.splitOrder) {
                    console.log('ChangeSubOrder')
                    
                    this.$store.dispatch('send', [
                        {cmd: 'changeOrderProduct', value: this.subOrder},
                    ])
                }

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
            closeResume() {
                this.showResume = false
                this.close()
            },

            abortSubOrder() {
                const subOrder = this.subOrder
                const order    = this.order

                const title = "Почему Вы хотите удалить этот товар?"
                const def = "Причина удаления"
                const answer = prompt(title, def)

                if (!answer) {
                    return 
                }

                const cmd = []

                // SUBORDER
                subOrder.note = answer
                subOrder.status = 'DEL'
                subOrder.end_time = Math.floor(Date.now() / 1000)
                subOrder.pause_start = Date.parse(subOrder.pause_start) / 1000
                cmd.push({cmd: 'changeSubOrder', value: subOrder})

                // ORDER
                // Если сабордер единственный, деактивируем ордер
                if (this.subOrders.length < 1) {
                    order.status = 'DEL'
                    cmd.push({cmd: 'changeOrder', value: order})
                }

                // PRODUCT
                this.product.status = 'free'                      
                this.product.updated = Date.parse(this.product.updated) / 1000                      
                cmd.push({cmd: 'setProduct', value: this.product})
                

                this.$store.dispatch('send', cmd)

                this.$emit('close')
            },

            stop() {
                this.stopSubOrder(this.order, this.subOrder)
                this.showResume = true
            },

            pauseSubOrder() {
                pause(this.subOrder)
                
                this.$store.dispatch('send', {cmd: 'changeSubOrder', value: this.subOrder})
            },

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
                this.subOrder.accessories = accessories

                this.status.changeSubOrder = true
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
            subOrders() {
                return this.$store.getters.subOrders.filter(i => {
                    return i.order_id === this.subOrder.order_id && (i.status === 'ACTIVE' || i.status === 'PAUSE')
                })
            },
            activeSubOrders() {
                return this.subOrders.filter(i => i.status === "ACTIVE")
            },

            activeSubOrders() {
                return this.subOrders.filter(i => i.status === "PAUSE")
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
    .change-order__button {
        font-size: 12px;
    }

    .icon {
        font-size: 20px;
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
