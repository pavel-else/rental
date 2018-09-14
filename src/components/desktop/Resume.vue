<!-- 
    Модуль принимает данные из order-list, отображает результаты 
 -->
<template>
    <div class="canvas">
        <div class="details"> 
            <table>
                    <tr>
                        <td>Заказ</td>
                        <td> # {{ order.order_id }}</td>
                    </tr>

                    <tr>
                        <td>Клиент</td>
                        <td>
                            <span v-if="order.customer_name">{{ order.customer_name }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>

                    <tr v-if="isLast(subOrder) && subOrders.length > 1">
                        <td>Товары</td>
                        <td class="suborders">
                            <table class="table-suborders">
                                <tr 
                                    v-for="item in subOrders" 
                                    :class="getClass(item.product_id)"
                                >
                                    <td>
                                        <span v-if="item.paid == 1" title="Оплачено">+</span>
                                        <span v-else title="Не оплачено">-</span>
                                    </td>
                                    <td>{{ getProductName(item.product_id) }}</td>
                                    <td v-if="item.bill > 0"> _ </td>
                                    <td>
                                        <span v-if="item.bill_rent > 0" title="Прокат">
                                            {{ +item.bill_rent + +item.bill_access}}  - {{ item.sale }}
                                        </span>
                                        р.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr v-else>
                        <td>
                            Товар
                        </td>
                        <td>
                            {{ getProductName(subOrder.product_id) }}
                        </td>

                    </tr>

                    <tr>
                        <td>Залог</td>
                        <td>
                            <span v-if="order.deposit">{{ order.deposit }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>

                    <tr>
                        <td>Начало</td>
                        <td>{{ order.start_time }}</td>
                    </tr>

                    <tr>
                        <td>Чистое время</td>
                        <td>{{ activeTime }}</td>
                    </tr>

                    <tr>
                        <td>Стоимость проката</td>
                        <td>{{ billRent }} р.</td>
                    </tr>

                    <tr v-if="accessories">
                        <td>Аксессуары</td>
                        <td>
                            <table class="accessories">
                                <tr 
                                    class="accessories__tr"
                                    v-for="item in accessories"
                                >
                                    <td>{{ item.name }}</td>
                                    <td> _ </td>
                                    <td>{{ item.value }} {{ item.type }}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="accessories__td--result"><b>= {{ billAccess }} р</b></td>
                                </tr>                    
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>Итого</td>
                        <td>
                            <span v-if="dontPay">{{ billRent + billAccess }} + {{ dontPay }} = {{ billRent + billAccess + dontPay }} р.</span>
                            <span v-else>{{ billRent + billAccess }} р.</span>
                        </td>
                    </tr>

                    <tr>
                        <td>Скидка</td>
                        <td>
                            <span>{{ sale }} р.</span>
                        </td>
                    </tr>

                    <tr>
                        <td>Аванс</td>
                        <td>
                            <span v-if="order.advance > 0">{{ order.advance }} р.</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                    

                    <tr class="details__bill">
                        <td>
                            <span v-if="total >= 0">
                                К оплате
                            </span>
                            <span v-else>Сдача</span>
                        </td>
                        <td>
                            {{ total }} р.
                        </td>
                    </tr>
            </table>

            <div class="btn-group">
                <button class="resume__button" @click="pay('money')">
                    <i class="fa fa-eur" aria-hidden="true"></i>Наличными
                </button>
                <button class="resume__button" @click="pay('card')">
                    <i class="icon fa fa-credit-card" aria-hidden="true"></i>Картой
                </button>
                <button class="resume__button" v-if="!isLast(subOrder)"@click="pay('dont pay')">
                    Без оплаты
                </button>
            </div>
        </div>
    </div> 
</template>

<script>
    import timeFormat    from '../../functions/timeFormat'
    import calculateBill from '../../functions/calculateBill'
    import roundBill     from '../../functions/roundBill'
    import pause         from './pause'


    export default {
        props: {
            cmd:       String,
            _order:    Object,
            _subOrder: Object
        },

        data() {
            return {
                order: {},
                subOrder: {},

                total: 0,

                cmds: []
            }
        },

        created() {
            console.log('cmd = ', this.cmd)

            if (this.cmd === 'stopOrder') {                
                this.order = this._order
                this.subOrder = this._subOrder

                if (this.subOrder.status == "PAUSE") {
                    pause(this.subOrder)
                }

                this.stopSubOrder(this.order, this.subOrder)
            }

            if (this.cmd === 'stopAllOrder') {                

                const subOrders = this.$store.getters.subOrders.filter(i => {
                    return i.order_id === this._order.order_id && (i.status === 'ACTIVE' || i.status === 'PAUSE')
                })

                if (!subOrders.length) {
                    return 
                }

                this.order = this._order

                for (let i = subOrders.length - 1; i > 0; i--) {
                    this.subOrder = subOrders[i]
                    this.stopSubOrder(this._order, this.subOrder)
                    
                    this.cmds.push({cmd: 'stopOrder', value: this.subOrder})
                }

                this.subOrder = subOrders[0]

                this.stopSubOrder(this.order, this.subOrder)
            }
        },

        methods: {
            ...timeFormat,
            ...calculateBill,

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product ? product.name : ''
            },

            getClass(product_id) {
                return {
                    select : this.subOrder.product_id == product_id
                }
            },

            isLast(subOrder) {
                /*
                * Функция нужна для проверки ордера - закрывается последний сабордер или нет?
                */

                // Заменить product_id на rent_id
                return this.subOrders.filter(i => i.status !== "END" && i.product_id != subOrder.product_id).length
                    ? false
                    : true
            },

            close() {
                this.$emit('close')
            },

            stopSubOrder(order, subOrder) {
                /*
                * Функция останавливает сабордер
                * Если сабордер последний, то подсчитывается конечная стоимость с учетом аванса и неоплаченых товаров
                */

                subOrder.end_time = Date.now()

                const billRent = this.billRent

                subOrder.bill_rent = billRent
                subOrder.bill_access = this.billAccess

                const advance = +order.advance

                this.total = !this.isLast(subOrder) 
                    ? billRent + this.billAccess - this.sale
                    : (billRent + this.billAccess - this.sale) + this.dontPay - advance

                this.total = roundBill(this.total)

                subOrder.sale = this.sale

                subOrder.status = "END"

                return subOrder
            },

            pay(type) {
                if (type === 'money') {
                    this.subOrder.paid = true
                }

                if (type === 'card') {
                    this.subOrder.paid = true
                }

                if (type === 'dont pay') {
                    this.subOrder.paid = false
                }

                this.cmds.push({cmd: 'stopOrder', value: this.subOrder})

                this.$store.dispatch('send', this.cmds)

                this.close()
            }
        },

        computed: {
            billRent() {
                // Обертка над calculateBill
                const time = this.subOrder.end_time - Date.parse(this.order.start_time) - this.subOrder.pause_time

                return +roundBill(this.calculateBill(this.subOrder.tariff_id, time))
            },

            billAccess() {
                return this.accessories ? this.accessories.reduce((acc, item) => {
                    acc += item.type == "%" 
                        ? this.subOrder.bill_rent * (item.value / 100)
                        : +item.value

                    return acc
                }, 0) : null
            },

            dontPay() {
                // Перебираю все неоплаченные
                return this.subOrders ? this.subOrders.reduce((acc, item) => {
                    if (item.paid == 0) {
                        acc += +item.bill_access + +item.bill_rent - +item.sale
                    }

                console.log(acc)
                    return acc                            
                }, 0) : 0
            },

            sale() {
                if (!this.customer || !this.customer.sale) {
                    return 0
                }

                const sale = (this.billRent + this.billAccess) * (this.customer.sale / 100)

                return roundBill(sale)
            },

            customer() {
                return this.$store.getters.customers.find(i => i.id_rent === this.order.customer_id)
            },

            accessories() {
                if (!this.subOrder.accessories) {
                    return null
                }

                const split = this.subOrder.accessories.split(',') // [1, 2]

                return split.map(i => {
                    return this.$store.getters.accessories.find(j => j.id_rent == i)
                })
            },

            activeTime() {
                const start = Date.parse(this.order.start_time)
                const end   = this.subOrder.end_time
                const pause = this.subOrder.pause_time ? this.subOrder.pause_time : 0
                const time = end - start - pause

                // console.log(start)
                // console.log(end)
                // console.log(pause)
                // console.log(time)
                // console.log(this.timeFormat(time))

                return this.timeFormat(time)
            },

            subOrders() {
                return this.$store.getters.subOrders.filter(i => i.order_id == this.order.order_id)
            }                
        }
    }
</script>

<style scoped>
    .details {
        position: absolute;
        top: 100px;
        left: calc(50% - 150px);
        min-width: 300px;
        padding: 5px 10px;
    }

    td {
        padding: 10px 5px;
    }

    td:first-child {
        padding-right: 10px;
    }
    .details li {
        display: block;
        margin: 0;
    }
    .details__bill td {
        padding-top:  20px;
        font-weight: bold;
    }

    .details__close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
    }
    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 9px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
    }

    .table-suborders {
        padding: 0;
        margin: 0;
    }
    .table-suborders td {
        padding: 2px 5px;
    }
    .select {
        outline: 1px solid #333;
    }

    .accessories,
    .suborders {
        font-size: 14px;
    }

    .accessories__tr td {
        padding: 1px 5px;
    }

    .accessories__td--result {
        padding-top: 10px;
        text-align: right;
    }

    .btn-group {
        display: flex;
    }

    .resume__button {
        display: flex;
    }

    .icon {
        display: block;
        margin-right: 10px;
    }
</style>