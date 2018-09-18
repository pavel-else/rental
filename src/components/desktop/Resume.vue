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
                        <td colspan="2">
                            <p>Товары</p>
                            <table class="suborders">
                                <tr v-for="(item, index) in subOrders">
                                    <td class="suborders__td--descript">
                                        <span v-if="item.id_rent === _subOrder.id_rent">></span>
                                    </td>
                                    <td class="suborders__td">
                                        {{ productNames[item.product_id] }}
                                    </td>
                                    <td class="suborders__td suborders__td--number" title="Прокат">
                                        {{ item.bill_rent }}
                                    </td>
                                    <td class="suborders__td suborders__td--sign">+</td>
                                    <td class="suborders__td suborders__td--number" title="Аксессуары">
                                        {{ item.bill_access }}
                                    </td>
                                    <td class="suborders__td suborders__td--sign">=</td>
                                    <td class="suborders__td suborders__td--number">
                                        {{ +item.bill_rent + +item.bill_access }}
                                    </td>
                                    <td class="suborders__td suborders__td--paid" v-if="item.paid === '1'">
                                        ✓
                                    </td>

                                </tr>
                                <tr>
                                    <td></td>
                                    <td colspan="3"><b>Итого</b></td>
                                    <td class="suborders__td suborders__td--rentbill" colspan="3">
                                        <b>{{ billRent }} р.</b>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr v-if="sale > 0">
                        <td>Скидка</td>
                        <td>
                            <span>{{ sale }} р.</span>
                        </td>
                    </tr>

                    <tr v-if="order.advance > 0">
                        <td>Аванс</td>
                        <td>
                            <span>{{ order.advance }} р.</span>
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
    import pause         from './functions/pause'
    import stopSubOrder  from './functions/stopSubOrder'
    import getSale       from './functions/getSale'


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

                cmds: [],
                productNames: []
            }
        },

        created() {                
            this.order = this._order
            this.subOrder = this._subOrder

            this.productNames = this.subOrders.reduce((acc, item) => {
                const product = this.$store.getters.products.find(i => i.id_rent === item.product_id)
                acc[product.id_rent] = product.name

                return acc
            }, {})

            if (this.subOrder.status == "PAUSE") {
                pause(this.subOrder)
            }
        },

        methods: {
            ...timeFormat,
            ...calculateBill,
            ...stopSubOrder,

            isLast(subOrder) {
                /*
                * Функция проверки ордера - закрывается последний сабордер?
                */

                return this.subOrders.filter(i => i.status !== "END" && i.id_rent != subOrder.id_rent).length
                    ? false
                    : true
            },

            close() {
                this.$emit('close')
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
                return this.subOrders.reduce((acc, item) => {
                    acc += +item.bill_rent + +item.bill_access
                    return acc
                }, 0)
            },

            dontPay() {
                // Перебираю все неоплаченные
                return this.subOrders ? this.subOrders.reduce((acc, item) => {
                    if (item.paid == 0) {
                        acc += +item.bill_access + +item.bill_rent - +item.sale
                    }

                    //console.log(item)
                    return acc                            
                }, 0) : 0
            },

            sale() {
                return this.subOrders.reduce((acc, item) => {
                    acc += +item.sale
                    return acc
                }, 0)
            },

            total() {
                return roundBill(this.billRent - this.sale) - +this.order.advance
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
        padding: 5px 5px 10px;
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

    .accessories {
        font-size: 14px;
    }

    .suborders {
        /*border: 1px solid #333;*/
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .suborders__td {
        padding: 2px 4px;
    }
    .suborders__td--descript {
        padding: 0;
        vertical-align: middle;
    }
    .suborders__td--number {
        padding: 2px 4px;
        text-align: center;
    }
    .suborders__td--sign {
        font-size: 12px;
        padding: 0;
    }
    .suborders__td--rentbill {
        text-align: right;;
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