<template>
    <div class="canvas">
        <div class="details">
            <h2>Оплата заказа</h2>
            <table class="resume__table">
                    <tr>
                        <td>Заказ</td>
                        <td> # {{ order.id_rent }}</td>
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
                        <td>Продолжительность</td>
                        <td>{{ activeTime }}</td>
                    </tr>

                    <tr>
                        <td colspan="2">
                            <ul class="products__list">
                                <li class="products__item" v-for="item in activeSubOrders" :key="item.id_rent">
                                    <div class="product-line">
                                        <span>{{ item.product_name }}</span>
                                        <span class="product-line__fill"></span>
                                        <span>{{ item.bill_rent }} руб.</span>                                      
                                    </div>

                                    <div class="product-line" v-for="accessory in item.extended_accessories" :key="item.id_rent + '_' + accessory.id_rent">
                                        <span>{{ accessory.name }}</span>
                                        <span class="product-line__fill"></span>
                                        <span>{{ accessory.bill_access }} руб.</span>                                        
                                    </div>
                                    <br>
                                </li>
                                <li class="products__item">
                                    <div class="product-line">
                                        <span><b>Итого</b></span>
                                        <span class="product-line__fill"></span>
                                        <span><b>{{ billRentAccess }} руб.</b></span>                                        
                                    </div>
                                </li>
                                <li class="products__item" v-if="billRentAccess !== billRentAccessSale">
                                    <div class="product-line">
                                        <span><b>С учетом скидки</b></span>
                                        <span class="product-line__fill"></span>
                                        <span><b>{{ billRentAccessSale }} руб.</b></span>                                        
                                    </div>
                                </li>
                                <li class="products__item">
                                    <div class="product-line" v-if="balanceAmound > 0">
                                        <span><b>С учетом суммы, списанной с баланса</b></span>
                                        <span class="product-line__fill"></span>
                                        <span><b>{{ billRentAccessSaleBalance }} руб.</b></span>                                        
                                    </div>
                                </li>

                                <li class="products__item" v-if="advance > 0" style="margin-top: 30px;">
                                    <div class="product-line">
                                        <span><b>Внесен аванс</b></span>
                                        <span class="product-line__fill"></span>
                                        <span><b>{{ advance }} руб.</b></span>                                        
                                    </div>
                                </li>
                            </ul>

                            <h3 class="resume__caption--total">
                                <span v-if="total >= 0">К оплате: {{ total }} руб.</span>
                                <span v-else>К сдаче: {{ Math.abs(total) }} руб.</span>
                            </h3>
                        </td>
                    </tr>
            </table>

            <div class="btn-group">
                <button class="resume__button" @click="pay('coin')">
                    <i class="fa fa-eur" aria-hidden="true"></i>Наличными
                </button>
                <button class="resume__button" @click="pay('card')">
                    <i class="icon fa fa-credit-card" aria-hidden="true"></i>Картой
                </button>
                <button class="resume__button" v-if="balance > 0 && !clickedBalance" @click="useBalance()">
                    <i class="fa fa-eur" aria-hidden="true"></i>С баланса: {{ balance }} руб.
                </button> 
            </div>

            <button class="details__close" @click.prevent="close"></button>
        </div>
    </div> 
</template>
<script>
    /*
    * Отправляет на сервер информацию о способе оплаты и списание с баланса
    */
    import timeFormat       from '@/functions/timeFormat';
    import roundBill        from '@/functions/roundBill';
    import getBill          from '@/functions/getBill';
    import getBillAccessory from '@/functions/getBillAccessory';
    import getSale          from '@/functions/getSale';
    import * as Time        from '@/functions/Time';
    import copy             from '@/functions/copy';

    export default {
        props: {
            _order: Object,
        },

        data() {
            return {
                activeSubOrders: [],
                order: copy(this._order),
                balanceAmound: 0, // сумма, списываемая с баланса
                clickedBalance: false
            }
        },
        created() {
            this.activeSubOrders = this.makeActiveSubOrders();
        },
        methods: {
            makeActiveSubOrders() {
                const subOrders = copy(this.$store.getters.subOrders.filter(i => i.order_id === this.order.id_rent && !i.paid));

                return subOrders.reduce((acc, item) => {
                    item.product_name = this.$store.getters.productNameById(item.product_id);

                    item.time = this.getTime(item);
                    item.bill_rent = this.getBillRent(item);
                    item.extended_accessories = this.makeAccessories(item);

                    item.bill_access = item.extended_accessories.reduce((acc, accessory) => {
                        acc += accessory.bill_access;
                        return acc;
                    }, 0);

                    item.sale = this.makeSale(item);


                    acc.push(item);
                    return acc;
                }, []);
            },
            getTime(subOrder) {
                const start = Date.parse(this.order.start_time);
                const pause = subOrder.pause_time; // Проверить, не надо ли добавлять. если сабордер на паузе
                const end = subOrder.end_time ? Date.parse(subOrder.end_time) : Date.now();
                return end - start - pause; 
            },
            getBillRent(subOrder) {
                const bill = getBill(subOrder.tariff_id, subOrder.time);
                return roundBill(bill);
            },
            makeAccessories(subOrder) {
                if (!subOrder.accessories) {
                    return [];
                }

                const split = subOrder.accessories.split(',') // [1, 2]
                const trim = split ? split.map(i => i.trim()) : [];

                const extendedAccessories = trim.reduce((acc, id) => {
                    const accessory = copy(this.$store.getters.accessories.find(i => i.id_rent === id));

                    if (!accessory) {
                        return acc;
                    }

                    const bill_access = getBillAccessory(accessory.type, accessory.value, subOrder.bill_rent);
                    accessory.bill_access = roundBill(bill_access);

                    acc.push(accessory);

                    return acc;
                }, []);

                return extendedAccessories;
            },
            makeSale(subOrder) {
                const billAllAccess = subOrder.extended_accessories.reduce((acc, accessory) => {
                    acc += accessory.bill_access;
                    return acc;
                }, 0);

                const sale = getSale((billAllAccess + subOrder.bill_rent), this.customer);

                return roundBill(sale);
            },
            useBalance() {
                // Просчет суммы, списываемой с баланса.
                this.balanceAmound = this.balance > this.billRentAccessSale ? this.billRentAccessSale : this.balance;
                this.clickedBalance = true;
            },

            close() {
                this.$emit('close');
            },

            pay(paidType) {

                const stopedSubOrders = this.activeSubOrders.map(i => {
                    const stopedSubOrder = this.stopSubOrder(i);
                    stopedSubOrder.paid = paidType;
                    return stopedSubOrder;
                });
                this.$store.dispatch('changeSubOrders', stopedSubOrders);

                const stopedOrder = this.stopOrder(this.order);
                this.$store.dispatch('changeOrder', stopedOrder);

                // dec product.mileage
                // dec customer.balance

                this.close();
            },
            stopSubOrder(_subOrder) {
                const subOrder = copy(_subOrder);

                subOrder.end_time = Time.format('YYYY-MM-DD hh:mm:ss');
                subOrder.status = "END";
                return subOrder;
            },
            stopOrder(_order) {
                const order = copy(_order);
                order.status = 'END';
                return order;
            },
            shortDate(date) {
                return Time.format('DD MMMM YYYY hh:mm', date);
            },
        },

        computed: {
            customer() {
                return this.$store.getters.customerById(this.order.customer_id);
            },

            billRentAccess() {
                return this.activeSubOrders.reduce((acc, item) => {
                    acc += +item.bill_rent + item.bill_access;
                    return acc;
                }, 0);
            },
            billRentAccessSale() {
                const summSale = this.activeSubOrders.reduce((acc, item) => {
                    acc += item.sale;
                    return acc;
                }, 0);

                return this.billRentAccess - summSale;
            },
            billRentAccessSaleBalance() {
                return this.billRentAccessSale - this.balanceAmound;
            },
            total() {
                return this.billRentAccessSaleBalance - this.advance;
            },


            activeTime() {
                const start = Date.parse(this.order.start_time);
                const end   = Date.now();
                const time = end - start;

                // console.log('start', start)
                // console.log('end', end)
                // console.log('pause', pause)
                // console.log('time', time)
                // console.log(timeFormat(time))

                return timeFormat(time);
            },
            deposit() {
                return this.$store.getters.deposits.find(i => i.id_rent === +this.order.deposit)
            },
            balance() {
                return this.customer ? this.customer.balance : 0; 
            },
            advance() {
                return this.order.advance;
            }
        }
    }
</script>

<style scoped>
    .details {
        top: 100px;
        width: 500px;
        min-width: 300px;
        padding: 5px 10px;
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

    .btn-group {
        display: flex;
    }

    .resume__button {
        display: flex;
    }
    .resume__table {
        width: 100%;
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
    .resume__caption--total {
        text-align: center;
        margin-top: 50px;
    }
</style>