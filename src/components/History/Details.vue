<template>
    <div class="canvas">
        <div class="details resume">
            <h2 class="resume__caption">Заказ # {{ order.id_rent }}</h2>

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
                    <td>Завершение</td>
                    <td>{{ shortDate(order.end_time) }}</td>
                </tr>

                <tr>
                    <td>Продолжительность</td>
                    <td>{{ order.play_time }}</td>
                </tr>
            </table>
                <!-- {{ order }} -->

            <div class="products">
                <ul class="products__list">
                    <li class="products__item" v-for="item in subOrders" :key="item.id_rent">
                        <div class="products__line">
                            <span>{{ item.product_name }}</span>
                            <span>{{ item.bill_rent }} руб.</span>                                      
                        </div>

                        <ul class="products__access-list">
                            <li class="products__access-item products__line" v-for="accessory in item.accessories" :key="accessory.id_rent">
                                <span class="products__arrow"> {{ accessory.name }}</span>
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
                    <li class="products__item" v-if="paidCoin > 0">
                        <div class="products__line">
                            <span class="products__text-resume">Оплачено наличными</span>
                            <span class="products__text-resume">
                                {{ paidCoin }} руб.
                            </span>
                        </div>
                    </li>
                    <li class="products__item" v-if="paidCard > 0">
                        <div class="products__line">
                            <span class="products__text-resume">Оплачено картой</span>
                            <span class="products__text-resume">
                                {{ paidCard }} руб.
                            </span>
                        </div>
                    </li>
                    <li class="products__item" v-if="order.off_balance > 0">
                        <div class="products__line">
                            <span class="products__text-resume">Списано с баланса</span>
                            <span class="products__text-resume">
                                {{ order.off_balance }} руб.
                            </span>
                        </div>
                    </li>

                </ul>
            </div>

            <button class="details__close" @click.prevent="close"></button>
        </div>
    </div> 
</template>

<script>
    /*
    * Отправляет на сервер информацию о способе оплаты и списание с баланса
    */
    // import timeFormat       from '@/functions/timeFormat';
    import roundBill        from '@/functions/roundBill';
    // import getBill          from '@/functions/getBill';
    import getBillAccessory from '@/functions/getBillAccessory';
    // import getSale          from '@/functions/getSale';
    import * as Time        from '@/functions/Time';
    import copy             from '@/functions/copy';

    export default {
        props: {
            _order: Object,
        },

        data() {
            return {
                order: copy(this._order),
            }
        },
        beforeCreate() {
            this.$store.dispatch('getAccessories');
        },
        created() {
            this.order.abs = 'asdfasdf';
        },
        methods: {
            close() {
                this.$emit('close');
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

            shortDate(date) {
                // return date;
                return Time.format('DD MMMM YYYY HH:mm', date);
            },
        },

        computed: {
            subOrders() {
                const subOrders = this.$store.getters.subOrders.filter(i => i.order_id === this.order.id_rent);

                return subOrders.reduce((acc, _item) => {
                    const item = copy(_item);

                    const product = this.$store.getters.products.find(i => i.id_rent === item.product_id);
                    item.product_name = product ? product.name : 'Нет имени';

                    item.accessories = this.makeAccessories(item);

                    acc.push(item);
                    return acc;
                }, []);
            },
            billRentAccess() {
                return this.subOrders.reduce((acc, item) => {
                    acc += +item.bill_rent + +item.bill_access;
                    return acc;
                }, 0);
            },
            billRentAccessSale() {
                const summSale = this.subOrders.reduce((acc, item) => {
                    acc += item.sale;
                    return acc;
                }, 0);

                return this.billRentAccess - summSale;
            },
            deposit() {
                return this.$store.getters.deposits.find(i => i.id_rent === +this.order.deposit)
            },
            paidCoin() {
                const summ = this.subOrders.reduce((acc, item) => {
                    if (item.paid === 'coin') {
                        acc += +item.bill_rent;
                        acc += +item.bill_access;
                        acc -= +item.sale;
                    }

                    return acc;
                }, 0);

                return summ - this.order.off_balance;
            },
            paidCard() {
                const summ = this.subOrders.reduce((acc, item) => {
                    if (item.paid === 'card') {
                        acc += +item.bill_rent;
                        acc += +item.bill_access;
                        acc -= +item.sale;
                    }

                    return acc;
                }, 0);

                return summ - this.order.off_balance;
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