<template>
    <div class="canvas">
        <div class="details resume">
            <h2 class="resume__caption">Оплата заказа # {{ order.id_rent }}</h2>

            <table class="resume__main-table">
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
            </table>

            <div class="products">
                <ul class="products__list">
                    <li class="products__item" v-for="item in activeSubOrders" :key="item.id_rent">
                        <div class="products__line">
                            <span>{{ item.product_name }}</span>
                            <!-- <span class="product-line__fill"></span> -->
                            <span>{{ item.bill_rent }} руб.</span>                                      
                        </div>

                        <ul class="products__access-list">
                            <li class="products__access-item products__line" v-for="accessory in item.extended_accessories" :key="accessory.id_rent">
                                <span class="products__arrow"> {{ accessory.name }}</span>
                                <!-- <span class="product-line__fill"></span> -->
                                <span>{{ accessory.bill_access }} руб.</span>                                        
                            </li>
                        </ul>
                    </li>
                    <li class="products__item">
                        <div class="products__line">
                            <span class="products__text-resume">Итого</span>
                            <span class="products__text-resume">
                                <s 
                                    v-if="billRentAccess > billRentAccessSale"
                                    style="margin-right: 5px"
                                >
                                    {{ billRentAccess }} 
                                </s>
                                {{ billRentAccessSale }} руб.
                            </span>
                        </div>
                    </li>

                </ul>
            </div>

            <div>
                Баланс клиента {{ balance }} руб, скидка {{ saleInPercent }} %
            </div>

<!--             <div class="product-line">
                <span><b>Итого</b></span>
                <span class="product-line__fill"></span>
                <span><b>{{ billRentAccess }} руб.</b></span>                                        
            </div>

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
                    </li> -->

            <!-- <h3 class="resume__caption--total">
                <span v-if="total >= 0">К оплате: {{ total }} руб.</span>
                <span v-else>К сдаче: {{ Math.abs(total) }} руб.</span>
            </h3> -->


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
                clickedBalance: false // используется для кнопки оплаты с баланса
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
                // Если сумма проката больше баланса, списывается весь баланс. Если меньше, то только сумма проката
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

                this.stopOrder();
                this.$store.dispatch('changeOrder', this.order);

                // inc product.mileage
                const products = stopedSubOrders.map(i => {
                    const product = copy(this.$store.getters.products.find(i => i.id_rent == i.product_id));
                });


                // dec customer.balance
                const customer = this.customer;
                if (customer) {
                    customer.balance -= this.balanceAmound;
                    this.$store.dispatch('setCustomer', customer);
                }


                this.close();
            },
            stopSubOrder(_subOrder) {
                const subOrder = copy(_subOrder);

                subOrder.end_time = Time.format('YYYY-MM-DD HH:mm:ss');
                subOrder.status = "END";
                return subOrder;
            },
            stopOrder() {
                this.order.status = 'END';
                this.order.off_balance = this.balanceAmound;
            },
            shortDate(date) {
                // return date;
                return Time.format('DD MMMM YYYY HH:mm', date);
            },
        },

        computed: {
            customer() {
                return copy(this.$store.getters.customerById(this.order.customer_id));
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
            },
            saleInPercent() {
                return this.customer ? this.customer.sale : 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .details {
        top: 50px;
        width: 420px;
        min-width: 300px;
        padding: 5px 30px;
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
    

    .resume__caption {
        text-align: center;
        margin: 10px 0 20px;
    }

    // Таблица содержащая общие сведения
    .resume__main-table {
        width: 100%;
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;

        td {
            padding: 5px;
        }

        td:last-child {
            text-align: right;
        }
    }

    .products {
        &__list {
            margin: 20px 50px 50px 30px;
        }
        &__item {            
            display: block;
            flex-direction: column;
            width: 100%;
            margin-top: 15px;
        }
        &__line {
            display: flex;
            justify-content: space-between;
        }
        &__access-item {
            margin: 5px 0;
        }
        &__arrow {
            display: flex;
            &::before {
                display: block;
                content: '';
                width: 15px;
                height: 15px;
                margin-right: 5px;
                background-image: url('https://app.rentix.biz/images/arrow.svg');
                background-size: 15px 15px;
                background-position: 2px -2px;
                background-repeat: no-repeat;
            }
        }
        &__text-resume {
            font-size: 18px;
        }
    }



    .resume__button {
        display: flex;
    }
    .icon {
        display: block;
        margin-right: 10px;
    }
    // .product-line {
    //     width: 100%;
    //     display: flex;
    //     justify-content: space-between;
    //     padding: 5px;
    // }
    .product-line__fill {
        //border-bottom: 2px dotted lightgray;
        flex-grow: 1;
        margin: 0 5px;
    }
    .resume__caption--total {
        text-align: center;
        margin-top: 50px;
    }
</style>