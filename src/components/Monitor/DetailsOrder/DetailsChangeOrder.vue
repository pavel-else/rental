<template>
    <div class="canvas">
        <div class="details change-order__datails">
            <h3>Детали заказа<span> - # {{ order.id_rent }}/{{ subOrder.id_rent }}</span></h3>
            <form @submit.prevent="">
                <table>
                    <tr>
                        <td>Товар</td>
                        <td>{{ product.name }}</td>
                    </tr>
                    <tr>
                        <td>Группа</td>
                        <td>
                            <Position :position="getPosition()" @setPosition="setPosition($event)"></Position>
                        </td>
                    </tr>
                    <tr>
                        <td>Статус</td>
                        <td>
                            {{ getStatus(subOrder.status) }}
                        </td>
                    </tr>
                    <tr>
                        <td>Аванс</td>
                        <td>
                            <input 
                                class="add-order__input add-order__input--advance" 
                                :value="order.advance" 
                                placeholder="0 руб"
                                @change="setAdvance($event)"
                            >

                        </td>
                    </tr>
                    <tr>
                        <td>Клиент</td>
                        <td>
                            <SelectCustomer 
                                :customer="order.customer_id"
                                @setCustomer="setCustomer($event)" 
                            >
                            </SelectCustomer>
                        </td>
                    </tr>
                    <tr>
                        <td>Залог</td>
                        <td>
                            <SelectDeposit 
                                :deposit="order.deposit" 
                                @setDeposit="setDeposit($event)"
                            >
                            </SelectDeposit>
                        </td>
                    </tr>
                    <tr>
                        <td>Примечание</td>
                        <td>
                            <textarea 
                                class="add-order__input add-order__input--note" 
                                cols="30" 
                                rows="3"
                                @input="setNote($event)"
                                :value="order.note"
                            >
                            </textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Акция</td>
                        <td>
                            <SelectPromotion 
                                :promotion="order.promotion" 
                                @setPromotion="setPromotion($event)"
                            >
                            </SelectPromotion>
                        </td>
                    </tr>
                    <tr>
                        <td>Аксессуары</td>
                        <td>
                            <SelectAccessories 
                                :accessory="subOrder.accessories" 
                                @setAccessories="setAccessories($event)"
                            >
                            </SelectAccessories>
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
                    <button class="change-order__button" @click="toPrint()">
                        Печать
                    </button>

                    <button class="change-order__button" @click.prevent="save()">
                        Сохранить                        
                    </button>

                    <button class="change-order__button" @click.prevent="abortSubOrder()">
                        Удалить
                    </button>

                    <!-- <button class="change-order__button" @click.prevent="stop()">
                        Стоп
                    </button> -->

                    <button class="change-order__button" @click.prevent="pauseSubOrder()">
                        Пауза
                    </button>
                </div>

                <button class="details__close" @click.prevent="close"></button>
            </form>

            <Print v-if="print" :order="order" @close="closePrint"></Print>

            <TotalResume v-if="showTotalResume" :_order="order" @close="close()"></TotalResume>
            <ResumeForOne v-if="showResumeForOne" :_order="order" :_subOrder="subOrder" @close="close()"></ResumeForOne>
        </div>
    </div>
</template>

<script>
    import Position          from './idPosition/idPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'
    import Print             from './Print'
    import stopSubOrder      from '../functions/stopSubOrder'
    import pause             from '../functions/pause'
    import TotalResume       from '../TotalResume';
    import ResumeForOne      from '../ResumeForOne';
    import * as Time         from '@/functions/Time';
    import getMileage        from '@/functions/getMileage';

    import copy from '@/functions/copy';

    export default {
        props: {
            _order: Object,
            _subOrder: Object
        },

        components: {
            Position,
            SelectCustomer,
            SelectAccessories,
            SelectTariff,
            SelectPromotion,
            SelectDeposit,
            Print,
            TotalResume,
            ResumeForOne
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
                showTotalResume: false,
                showResumeForOne: false
            }
        },

        created() {
            this.order = copy(this._order);
            this.subOrder = copy(this._subOrder);
            const product = this.products.find(i => i.id_rent == this.subOrder.product_id);
            this.product = copy(product);
        },

        methods: {
            ...stopSubOrder,

            close() {
                this.$emit('close');
            },

            save() {
                // console.log('changeOrder', this.status);

                const cmds = [];

                // changeOrder
                if (this.status.changeOrder) {  
                    cmds.push({cmd: 'changeOrder', value: this.order });                  
                }

                // changeProduct
                if (this.status.changeSubOrder && !this.status.splitOrder) {
                    cmds.push({cmd: 'changeSubOrder', value: this.subOrder });
                }

                // splitOrder
                if (this.status.splitOrder) {
                    cmds.push({ cmd: 'splitOrder', value: { order: this.order, subOrder: this.subOrder } });
                }

                cmds.push(
                    { cmd: 'getActiveOrders' },
                    { cmd: 'getActiveSubOrders' },
                );

                this.$store.dispatch('multipleRequest', cmds);
                this.close()
            },

            toPrint() {
                this.print = true
            },
            closePrint() {
                this.print = false
            },
            getTime(subOrder) {
                const start = Date.parse(this.order.start_time);

                let pause = 0;

                if (subOrder.status === 'PAUSE') {
                    const lastPause = Date.now() - +subOrder.pause_start;
                    pause = +subOrder.pause_time + lastPause;
                } else {
                    pause = subOrder.pause_time;
                }


                const end = subOrder.end_time ? Date.parse(subOrder.end_time) : Date.now();

                return end - start - pause; 
            },

            abortSubOrder() {
                const subOrder = this.subOrder;
                const order    = this.order;

                const title = "Почему Вы хотите удалить этот товар?";
                const def = "Причина удаления";
                const answer = prompt(title, def);

                if (!answer) {
                    return false;
                }

                const cmds = [];

                // SUBORDER
                subOrder.note = answer;

                if (subOrder.status === 'PAUSE') {
                    const pause = Date.now() - +subOrder.pause_start;
                    subOrder.pause_time = +subOrder.pause_time + pause;
                    subOrder.pause_start = 0;                    
                }

                subOrder.end_time = Time.format('YYYY-MM-DD HH:mm:ss');

                subOrder.status = 'DEL';

                // Mileaage
                const product = copy(this.$store.getters.products.find(product => product.id_rent === subOrder.product_id));
                const tariff = this.$store.getters.tariffs.find(i => i.id_rent === subOrder.tariff_id);
                const playTime = this.getTime(subOrder);
                const mileage = getMileage(playTime, tariff);
                console.log('mileage', mileage)

                if (mileage && mileage > 0) {
                    product.mileage = +product.mileage + mileage;
                    cmds.push({ cmd: 'setProduct', value: product});
                }

                cmds.push({ cmd: 'changeSubOrder', value: subOrder });

                // ORDER
                // Если сабордер единственный, деактивируем ордер
                if (this.subOrders.length <= 1) {
                    order.status = 'DEL';
                    cmds.push({ cmd: 'changeOrder', value: order }, { cmd: 'getActiveOrders' });
                }
               
                cmds.push(
                    { cmd: 'getActiveOrders' },
                    { cmd: 'getActiveSubOrders' },
                );

                this.$store.dispatch('multipleRequest', cmds);

                this.$emit('close');
            },

            stop() {
                const isLast = (subOrder) => {
                    const list = this.$store.getters.activeSubOrders.filter(i => {
                        return i.order_id === subOrder.order_id && i.id_rent !== subOrder.id_rent;
                    });

                    return list.length === 0;
                };

                if (isLast(this.subOrder)) {
                    this.showTotalResume = true;
                } else {
                    this.showResumeForOne = true;
                }
            },

            pauseSubOrder() {
                pause(this.subOrder);
                
                this.$store.dispatch('multipleRequest', [
                    { cmd: 'changeSubOrder', value: this.subOrder },
                    { cmd: 'getActiveSubOrders' }
                ]);
            },

            getPosition() {
                if (this.order.order_id_position) {
                    return this.order.order_id_position
                }
            },

            splitOrder(order_id, position) {
                const order = this.order;
                const subOrder = this.subOrder;

                this.status.splitOrder = true;

                order.old_id = this.order.id_rent;

                order.id_rent = order_id;
                order.start_time = Date.parse(this.order.start_time);
                order.order_id_position = position;
                console.log('position', position)

                this.order = order;
                this.subOrder = subOrder;
            },

            setPosition({ order_id, order_id_position }) {
                if (!this.orders.find(i => i.id_rent == order_id)) {
                    this.status.splitOrder = true;
                    this.splitOrder(order_id, order_id_position);
                }
            },
                
            setCustomer(customer) {
                this.order.customer_id = customer.id_rent 
                this.order.customer_name = `${customer.fname} ${customer.sname} ${customer.tname}`

                this.status.changeOrder = true
            },

            setAdvance(event) {
                this.order.advance = event.target.value;
                this.status.changeOrder = true;
            },

            setDeposit(deposit) {
                this.order.deposit = deposit.id_rent

                this.status.changeOrder = true
            },

            setNote(event) {
                this.order.note = event.target.value;
                this.status.changeOrder = true;
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

            getStatus(status) {
                switch(status) {
                    case 'END': return 'Завершен';
                    case 'ACTIVE': return 'В прокате';
                    default: '';
                }
            }
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

                const ids = this.product.tariff_ids.split(',')

                return ids.map(id => {
                    return this.$store.getters.tariffs.find(tariff => tariff.id_rent === id)
                })
            },
            subOrders() {
                return this.$store.getters.activeSubOrders;
            },
        },
    }
</script>

<style scoped>
    .change-order__datails {
        width: 420px;
        margin-top: 50px;
        padding: 10px 20px;
    }

    .change-order__datails td {
        padding: 5px 0;
    }
    .btn-group {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .change-order__button {
        font-size: 12px;
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
