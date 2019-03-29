<template>
    <div class="canvas">
        <div class="details resume">
            <h2 class="resume__caption">Оплата заказа # {{ order.id_rent }} / {{ subOrder.id_rent }}</h2>

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
                <tr v-if="order.note">
                    <td>Примечание</td>
                    <td>{{ order.note }}</td>
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
                            <span class="products__text-resume">Итого<span v-if="saleSize > 0"> (скидка {{ saleSize }}%) </span></span>
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

            <table>
                <tr>
                    <td>Внесен аванс:</td>
                    <td style="text-align: right">{{ advance }} руб</td>
                </tr>
                <tr>
                    <td>
                        <span v-if="balance < 0">Долг клиента:</span>
                        <span v-else>Баланс клиента:</span>
                    </td>
                    <td style="text-align: right" :style="styleBalance">{{ Math.abs(balance) }} руб</td>
                    <td>
                        <input
                            v-if="balance !== 0"
                            type="checkbox"
                            :checked="isApplyBalance"
                            :title="balance < 0 ? 'Погасить сейчас' : 'Использовать при оплате'"
                            @click="checkBalance($event)"
                        >
                    </td>
                </tr>
            </table>

            <div class="total">
                <span>{{ msgTotal }}</span>
                <span> {{ total }} руб.</span>
            </div>
            <!-- off_balance: {{ balanceAmound }} -->
            <div class="btn-group">
                <button class="resume__button" @click="pay('card')">
                    <i class="icon fa fa-credit-card" aria-hidden="true"></i>Картой
                </button>
                <button class="resume__button" @click="pay('coin')">
                    <i class="fa fa-eur" aria-hidden="true"></i>Наличными
                </button><!-- 
                <button class="resume__button" @click="pay('no')">
                    <i class="fa" aria-hidden="true"></i>Без оплаты
                </button> -->
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
    import getMileage       from '@/functions/getMileage';
    import * as Time        from '@/functions/Time';
    import copy             from '@/functions/copy';

    export default {
        props: {
            _order: Object,
            _subOrder: Object
        },

        data() {
            return {
                activeSubOrders: [],

                order: copy(this._order),
                subOrder: copy(this._subOrder),

                balanceAmound: 0,
                isApplyBalance: true, // используется для чекбокса оплаты с баланса
                total: 0,
                msgTotal: ''
            }
        },
        created() {
            this.activeSubOrders = this.makeActiveSubOrders();
            this.makeTotal();
        },
        methods: {
            makeActiveSubOrders() {
                let subOrders = [];

                if (this.subOrder) {
                    subOrders.push(this.subOrder);
                }

                return subOrders.reduce((acc, item) => {
                    const product = this.$store.getters.products.find(i => i.id_rent === item.product_id);
                    item.product_name = product ? product.name : 'Нет имени';

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

                let pause = 0;

                if (subOrder.status === 'PAUSE') {
                    const lastPause = Date.now() - +subOrder.pause_start;
                    pause = +subOrder.pause_time + lastPause;
                } else {
                    pause = subOrder.pause_time; // Проверить, не надо ли добавлять. если сабордер на паузе
                }


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
            close() {
                this.$emit('close');
            },
            
            pay(paidType) {
                let cmds = [];

                // Останавливаем сабордеры
                const stopedSubOrders = this.activeSubOrders.map(i => {
                    const stopedSubOrder = this.stopSubOrder(i);
                    stopedSubOrder.paid = paidType;

                    return stopedSubOrder;
                });

                // Загоняем их в массив для отправки
                stopedSubOrders.map(i => cmds.push({ cmd: 'changeSubOrder', value: i }));

                // Остановка ордера
                // this.stopOrder();
                // cmds.push({ cmd: 'changeOrder', value: this.order });

                // Увеличиваем пробег
                stopedSubOrders.map(subOrder => {
                    const product = copy(this.$store.getters.products.find(product => product.id_rent === subOrder.product_id));

                    const tariff = this.$store.getters.tariffs.find(i => i.id_rent === subOrder.tariff_id);
                    const mileage = getMileage(subOrder.time, tariff);

                    if (mileage && mileage > 0) {
                        product.mileage = +product.mileage + mileage;
                        cmds.push({ cmd: 'setProduct', value: product});
                    }
                });

                // Уменьшаем баланс клиента
                const customer = this.customer;
                if (customer) {
                    customer.balance = +customer.balance + this.balanceAmound;
                    cmds.push({ cmd: 'setCustomer', value: customer});
                }

                cmds = [
                ...cmds, 
                    { cmd: 'getActiveOrders' }, 
                    { cmd: 'getActiveSubOrders' }, 
                    { cmd: 'getProducts' }, 
                    { cmd: 'getTariffs' }, 
                    { cmd: 'getCustomers' }, 
                    { cmd: 'getAccessories' },
                    { cmd: 'getGeneralSettings' }
                ];

                this.$store.dispatch('multipleRequest', cmds);
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
            checkBalance() {
                this.isApplyBalance = !this.isApplyBalance;
                this.makeTotal();

                // this.balanceAmound = 0;

                // if (this.isApplyBalance) {
                //     this.balanceAmound = this.getBalanceAmound();    
                // }
                // console.log(this.balanceAmound);
            },
            getBalanceAmound() {
                const bill =  this.billRentAccessSale;
                const balance = this.balance;

                return balance > bill ? -(bill) : -(balance);
            },
            makeTotal() {
                const bill = this.billRentAccessSale;
                const balance = this.balance;
                const advance = this.advance;

                let total = false;
                let msg = 'msg';
                let amound = 0;

                // Если был внесен аванс и не используется баланс
                if (advance > 0 && !this.isApplyBalance) {
                    total = Math.abs(advance - bill);
                    msg = advance > bill ? 'К сдаче: ' : 'К оплате: ';
                }

                // Если аванса не было и не используется баланс
                if (advance <= 0 && !this.isApplyBalance) {
                    total = bill;
                    msg = 'К оплате: ';
                }

                // Если был внесен аванс и используется баланс
                if (advance > 0 && this.isApplyBalance) {

                    // если накатано меньше, чем на балансе, в сдаче аванс
                    if (balance > bill) {
                        total = advance;
                        msg = 'Возврат аванса: ';

                        amound = -(bill);
                    }

                    if (balance <= bill) {
                        amound = -(balance);

                        const diff = bill - balance;

                        msg = advance > diff ? ' К сдаче: ' : 'К оплате: ';
                        total = Math.abs(advance - diff); 
                    }
                }

                // Если аванса не было и используется баланс
                if (advance <= 0 && this.isApplyBalance) {
                    if (balance > bill) {
                        total = 0;
                        msg = 'К оплате: ';
                        amound = -(bill);
                    }
                    if (balance <= bill) {
                        total = bill - balance;
                        msg = 'К оплате: ';
                        amound = -(balance);
                    }
                }

                this.total = total;
                this.msgTotal = msg;
                this.balanceAmound = amound;
            }
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
            billRentAccessSaleAdvance() {
                return this.billRentAccessSale - this.advance;
            },
            billRentAccessSaleAdvanceBalance() {
                return -this.advance
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
                return this.customer && this.customer.balance ? +this.customer.balance : 0; 
            },
            advance() {
                return this.order.advance ? +this.order.advance : 0;
            },
            saleSize() {
                return this.customer ? +this.customer.sale : 0;
            },
            styleBalance() {
                return {
                    color: this.balance < 0 ? 'red' : 'green'
                }
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
        padding-bottom: 30px;
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
        justify-content: center;
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

    .total {
        font-size: 24px;
        text-align: center;
        margin: 50px 0 40px;
    }

    .resume__button {
        display: flex;
    }
    .icon {
        display: block;
        margin-right: 10px;
    }
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