<template>

    <div class="add-order">
        <h3>
            <span v-if="status === 'newOrder'">Новый заказ #{{ order.id_rent }}</span>
            <span v-else>Добавить товар к заказу #{{ order.id_rent }}</span>
        </h3>
        <form @submit.prevent="">
            <table class="add-order__table">
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
                    <td>Аванс</td>
                    <td>
                        <input
                            class="add-order__input add-order__input--advance"
                            v-model="order.advance"
                            placeholder="0 руб"
                        >
                    </td>
                </tr>
                <tr>
                    <td class="customer">Клиент</td>
                    <td>
                        <SelectCustomer
                            id="select_customer"
                            :customer="order.customer_id"
                            :focus="order.customer_id ? false : true"
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
                            v-model="order.note"
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

            <div class="button-group">
                <button @click.prevent="save">Сохранить</button>
                <button type="button" @click.prevent="close">Отмена</button>
            </div>
        </form>
    </div>

</template>

<script>
    import copy              from '@/functions/copy'
    import makeCustomerName   from '@/functions/makeCustomerName';

    import initOrder         from '../functions/initOrder'

    import Position          from './idPosition/idPosition'
    import SelectCustomer    from './SelectCustomer'
    import SelectAccessories from './SelectAccessories'
    import SelectTariff      from './SelectTariff'
    import SelectPromotion   from './SelectPromotion'
    import SelectDeposit     from './SelectDeposit'

    export default {
        name: "DetailsOrder",
        props: {
            product: Object
        },

        components: {
            Position,
            SelectCustomer,
            SelectAccessories,
            SelectTariff,
            SelectPromotion,
            SelectDeposit,
        },

        created() {
            this.isSerial() ? 
                this.addSubOrder(this.getLastId()) : 
                this.newOrder()   
        },
        data() {
            return {
                order: {
                    status:             null,              
                    start_time:         null,         
                    id_rent:            null,           
                    order_id_position:  null,  
                    advance:            null,            
                    note:               null,               
                    products:           null,
                    promotion:          null,          
                    customer_id:        null,        
                    deposit:            null,
                },

                subOrder: {
                    id_rent:      null,
                    order_id:     null,
                    product_id:   null,
                    tariff_id:    null,
                    accessories:  null,        
                    bill:         0,
                    bill_rent:    0,
                    bill_access:  0,
                    sale:         0,
                    paid:         false,
                    pause_start:  0,
                    pause_time:   0,
                    end_time:     null,
                    note:         null,
                    status:       null,
                },              

                status: null,
            }
        },
        
        methods: {
            isSerial() {
                /*
                * Функция определяет, является ли новый сабордер новым заказом или же это часть предыдущего ордера
                */
                const lastTime = this.$store.getters.generalSettings.lastOrderTime || false;
                const interval = this.$store.getters.generalSettings.lastOrderInterval;
                const now      = this.$store.getters.now;
                const lastID   = this.getLastId();
                const order    = this.orders.find(i => i.id_rent == lastID);

                // Если последний ордер уже закрыт
                if (!order || order.status === 'END' || order.status === 'DEL') {
                    return false;
                }

                return (lastTime) && (now - lastTime < interval);
            },
            getLastId() {
                const ids = this.$store.getters.activeOrders.map(i => i.id_rent);

                return Math.max(...ids);
            },
            close() {
                this.$emit('close')
            },

            save() {
                // newOrder
                if (this.status == 'newOrder') {

                    const settings = {
                        lastOrderTime: Date.now(),
                    }

                    this.$store.dispatch('multipleRequest', [
                        { cmd: 'newOrder',           value: this.order },
                        { cmd: 'newSubOrder',        value: this.subOrder },
                        { cmd: 'setGeneralSettings', value: settings },

                        { cmd: 'getActiveOrders' }, 
                        { cmd: 'getActiveSubOrders' }, 
                        { cmd: 'getProducts' }, 
                        { cmd: 'getTariffs' }, 
                        { cmd: 'getCustomers' }, 
                        { cmd: 'getAccessories' },
                        { cmd: 'getGeneralSettings' }
                    ]);

                }

                // addSubOrder
                if (this.status == 'addSubOrder') {
                    this.$store.dispatch('multipleRequest', [
                        { cmd: 'newSubOrder', value: this.subOrder },
                        { cmd: 'changeOrder', value: this.order },

                        { cmd: 'getActiveOrders' }, 
                        { cmd: 'getActiveSubOrders' }, 
                        { cmd: 'getProducts' }, 
                        { cmd: 'getTariffs' }, 
                        { cmd: 'getCustomers' }, 
                        { cmd: 'getAccessories' },
                        { cmd: 'getGeneralSettings' }
                    ]);
                }
                
                this.close();
            },

            newOrder(order_id_position) {
                this.order = initOrder()

                this.order.status              = 'ACTIVE'
                this.order.start_time          = Date.now() + this.registrationTime
                this.order.id_rent             = null;
                this.order.order_id_position   = order_id_position || this.getPosition('new')

                const customer = this.getCustomer();

                this.order.customer_id = customer ? customer.id_rent : null;
                this.order.customer_name = customer ? makeCustomerName(customer) : null;
                
                this.subOrder.id_rent    = null;
                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.id_rent
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0
                
                this.status = 'newOrder'
            },

            addSubOrder(order_id) {
                if (!order_id) {
                    console.log('empty order_id!')
                    return
                }

                const order = this.orders.find(i => i.id_rent == order_id)

                if (!order) {
                    console.log('order not found!')
                }

                this.order = copy(order)

                this.subOrder.id_rent    = null;
                this.subOrder.product_id = this.product.id_rent
                this.subOrder.tariff_id  = this.product.tariff_default
                this.subOrder.order_id   = this.order.id_rent
                this.subOrder.status     = 'ACTIVE'
                this.subOrder.pause_time = 0

                this.status = 'addSubOrder'

                // console.log(this.subOrder)
            },

            getPosition(cmd) {
                const newPosition = () => {
                    const orders = this.$store.getters.activeOrders;
                    const count = 15
                    let id = null

                    const iter = (num) => {
                        id = orders.find(item => item.order_id_position == num) ? id : num

                        return num < 1 ? id : iter(num - 1)
                    }

                    const result = iter(count)
                    // this.order.order_id_position = result

                    return +result                    
                }

                if (cmd == 'new') {
                    return newPosition()
                }

                if (this.status == 'newOrder') {
                    return newPosition()
                }

                if (this.status == 'addSubOrder') {
                    return this.order.order_id_position
                }
            },

            setPosition({ order_id, order_id_position }) {

                this.orders.find(i => i.id_rent == order_id)
                    ? this.addSubOrder(order_id)                    
                    : this.newOrder(order_id_position)
            },
            
            getCustomer() {
                // Если клиент создан недавно, в течении установленного Периода,
                // то выводить его в автозаполнении

                const lastCustomer = this.$store.getters.lastCustomer;

                const period = 1000 * 60 * (3 + 3); // ms * s * (отставание часов сервера + значение периода в минутах)

                if (Date.parse(lastCustomer.created) + period > Date.now()) {
                    return lastCustomer;
                }

                return null;
            },
            setCustomer(customer) {
                if (customer) {
                    this.order.customer_id = customer.id_rent

                    const f = customer.fname ? customer.fname : '';
                    const s = customer.sname ? customer.sname : '';
                    const t = customer.tname ? customer.tname : '';


                    this.order.customer_name = `${f} ${s} ${t}`
                }
            },

            setDeposit(deposit) {
                if (deposit) {
                    this.order.deposit = deposit.id_rent
                }
            },             

            setPromotion(promotion) {                 
                if (promotion) {
                    this.order.promotion = promotion.id               
                }
            },

            setAccessories(accessories) {
                this.subOrder.accessories = accessories
            },

            setTariff(tariff) {
                this.subOrder.tariff_id = tariff.id_rent
            },
        },

        computed: {
            orders() {
                return this.$store.getters.activeOrders;
            },
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

                const result =  ids.reduce((acc, id) => {

                    const find = this.$store.getters.tariffs.find(tariff => tariff.id_rent === id)
                    if (find) acc.push(find)
                    return acc
                }, [])

                return result
            },
            registrationTime() {
                return +this.$store.getters.generalSettings.registration_time
            }
        },
    }
</script>

<style lang="sass" scoped>

.add-order
    padding: 10px 20px

    .add-order__table
        margin-bottom: 50px

    td
        padding: 5px 0

    td:first-child
        padding-right: 10px


    .btn-group
        margin-top: 20px


    .add-order__input
        width: 100%
        min-height: 40px
        box-sizing: border-box
        border: 1px solid lightgray
        padding-left: 10px


    .add-order__input--advance
        background-color: #000
        border: 1px solid #333
        color: rgba(255, 255, 255, 0.8)


    .add-order__input--note
        resize: vertical
        width: 101%
        background-color: #000
        border-color: #333
        color: rgba(255, 255, 255, .8)
        font-family: Roboto Condensed

    .button-group
        display: flex
        justify-content: center


@media screen and (max-width: 420px)
    .add-order
        td:first-child
            display: none

</style>

<style lang="scss">
    /*Style to Multiple Select*/
    .add-order {
        .multiselect {
            background-color: #000;
            border-radius: 0;
            border: 1px solid #333;
        }

        .multiselect__tags {
            background-color: #000;
            border: none;
            color: rgba(255, 255, 255, 0.8);
        }

        .multiselect__single {
            background-color: #000;
        }    
    }
</style>
