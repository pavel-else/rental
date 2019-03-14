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
                            <span v-if="deposit">{{ deposit.name }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>

                    <tr>
                        <td>Начало</td>
                        <td>{{ shortDate(order.start_time) }}</td>
                    </tr>

                    <tr>
<!--                         <td>Чистое время</td>
                        <td>{{ activeTime }}</td> -->
                    </tr>

                    <tr>
<!--                         <td colspan="2">
                            <p>Товары</p>
                            <ul class="products__list">
                                <li class="products__item" v-for="subOrder in subOrders" :key="subOrder.id_rent">
                                    <div class="product-line">
                                        <span>{{ productNames[subOrder.product_id] }}</span>
                                        <span class="product-line__fill"></span>
                                        <span>{{ subOrder.bill_rent }} руб.</span>                                        
                                    </div>

                                    <div class="product-line" v-if="subOrder.bill_access > 0">
                                        <span>Аксессуары</span>
                                        <span class="product-line__fill"></span>
                                        <span>{{ subOrder.bill_access }} руб.</span>                                        
                                    </div>

                                </li>
                            </ul>


                            <div class="product-line">
                                <span>Итого</span>
                                <span class="product-line__fill"></span>
                                <span>{{ total }} руб.</span>                                        
                            </div>
                        </td> -->
                    </tr>

<!--                     <tr v-if="sale > 0">
                        <td>С учетом скидки клиента ({{ customer.sale }}%)</td>
                        <td>
                            <span>{{ total - sale }} р.</span>
                        </td>
                    </tr> -->

                    <!-- <tr v-if="paidBefore > 0">
                        <td>Оплачено ранее</td>
                        <td>
                            <span>{{ paidBefore }}</span>
                            <span v-if="saledBefore" :title="'С учетом скидки ' + saledBefore + ' р.'">({{ paidBefore - saledBefore }})</span>
                             р.
                        </td>
                    </tr> -->

                    <!-- <tr v-if="isLast() && order.advance > 0">
                        <td>Аванс</td>
                        <td>
                            <span>{{ order.advance }} р.</span>
                        </td>
                    </tr> -->
                    

                    <!-- <tr class="details__bill">
                        <td>
                            <span v-if="toPay >= 0">
                                К оплате
                            </span>
                            <span v-else>Сдача</span>
                        </td>
                        <td>
                            {{ toPay }} р.
                        </td>
                    </tr> -->
            </table>

            <div class="btn-group">
                <button class="resume__button" @click="pay('money')">
                    <i class="fa fa-eur" aria-hidden="true"></i>Наличными
                </button>
                <button class="resume__button" @click="pay('card')">
                    <i class="icon fa fa-credit-card" aria-hidden="true"></i>Картой
                </button>
                <!-- <button class="resume__button" v-if="!isLast()" @click="pay('dont pay')">
                    Без оплаты
                </button> -->
            </div>
        </div>
    </div> 
</template>
<script>
    /*
    * Компонент работает с уже закрытым ордером. 
    * Отправляет на сервер информацию о способе оплаты и списание с баланса
    */
    import timeFormat from '@/functions/timeFormat';
    import roundBill  from '@/functions/roundBill';
    import * as Time  from '@/functions/Time';
    import copy       from '@/functions/copy';


    export default {
        props: {
            order: Object, 
        },

        data() {
            return {
                subOrders: this.$store.getters.subOrders.filter(i = i.order_id === this.order.id_rent)

            }
        },
        methods: {
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

                // if (type === 'dont pay') {
                //     this.subOrder.paid = false
                // }

                this.cmds.push({cmd: 'stopOrder', value: this.subOrder})

                this.$store.dispatch('send', this.cmds)

                this.close()
            },
            shortDate(date) {
                return Time.format('DD MMMM YYYY hh:mm', date);
            },
        },

        computed: {
            // billRent() {
            //     return this.isLast() 
            //         ? this.subOrders.reduce((acc, item) => {
            //             acc += +item.bill_rent + +item.bill_access
            //             return acc
            //         }, 0)
            //         : +this.subOrder.bill_rent + this.subOrder.bill_access
            // },

            // paidBefore() {
            //     // Перебираю все оплаченые
            //     return this.subOrders ? this.subOrders.reduce((acc, item) => {
            //         if (item.paid == 1) {
            //             acc += +item.bill_access + +item.bill_rent
            //         }

            //         //console.log(item)
            //         return acc                            
            //     }, 0) : 0
            // },
            // saledBefore() {
            //     // Перебираю все оплаченые
            //     return this.subOrders ? this.subOrders.reduce((acc, item) => {
            //         if (item.paid == 1) {
            //             acc += +item.sale
            //         }

            //         return acc                            
            //     }, 0) : 0
            // },

            // sale() {
            //     return this.isLast() 
            //         ? this.subOrders.reduce((acc, item) => {
            //             acc += +item.sale
            //             return acc
            //         }, 0)
            //         : +this.subOrder.sale
            // },

            // advance() {
            //     return this.isLast() ? this.order.advance : 0
            // },

            // total() {
            //     return roundBill(this.billRent - this.paidBefore);

            // },

            // toPay() {
            //     return this.isLast 
            //         ? roundBill((this.billRent - this.paidBefore) - (this.sale - this.saledBefore)) - +this.advance
            //         : this.billRent - this.sale
            // },

            // customer() {
            //     return this.$store.getters.customers.find(i => i.id_rent == this.order.customer_id)
            // },

            // accessories() {
            //     if (!this.subOrder.accessories) {
            //         return null
            //     }

            //     const split = this.subOrder.accessories.split(',') // [1, 2]

            //     return split.map(i => {
            //         return this.$store.getters.accessories.find(j => j.id_rent == i)
            //     })
            // },

            // activeTime() {
            //     const start = Date.parse(this.order.start_time)
            //     const end   = Date.parse(this.subOrder.end_time)
            //     const pause = this.subOrder.pause_time ? this.subOrder.pause_time : 0
            //     const time = end - start - pause

            //     // console.log('start', start)
            //     // console.log('end', end)
            //     // console.log('pause', pause)
            //     // console.log('time', time)
            //     // console.log(timeFormat(time))

            //     return timeFormat(time)
            // },
            deposit() {
                return this.$store.getters.deposits.find(i => i.id_rent === +this.order.deposit)
            },

            subOrders() {
                return this.$store.getters.subOrders.filter(i => {
                    return i.order_id == this.order.order_id && i.status !== "DEL"
                });
            },
            unpaidSubOrders() {

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
    .suborders__td--name {
        padding-right: 20px;
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
        text-align: right;
    }
    .suborders__td--paid {
        vertical-align: top;
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

    .products__item {
        display: flex;
        flex-direction: column;
    }
    .product-line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 5px;
    }
    .product-line__fill {
        border-bottom: 2px dotted lightgray;
        flex-grow: 1;
        margin: 0 5px;
    }
</style>