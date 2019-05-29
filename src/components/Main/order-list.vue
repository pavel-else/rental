<template>
    <div class="order-list">
        <h3>В прокате <span>({{ length }})</span></h3>

        <table cellspacing="0" class="table">
            <tr
                class="table-tr"
                v-for="order in ordersByCategory"
                :key="order.id_rent"
                :title="order.title"
            >
                <td class="td-1">
                    <Icon :id="order.order_id_position" :show="true"></Icon>
                </td>

                <td class="td-2">{{ order.format_start_time }}</td>

                <td>
                    <tr
                        class="product-tr"
                        v-for="subOrder in order.subOrders"
                        :key="subOrder.id_rent"
                        :class="subOrder.status === 'PAUSE' ? 'suborder--pause' : 'suborder--active'"
                    >
                        <td class="td-3" @click="toChange(order, subOrder)" >{{ subOrder.product_name }}</td>

                        <!-- <td class="td-3" @click="toChange(order, subOrder)" >
                            <span v-for="accessory in subOrder.extAccessories" :key="subOrder.id_rent+accessory">{{ accessory }}</span>
                        </td> -->

                        <td class="td-4" @click="toChange(order, subOrder)" >{{ getTimePlay(order, subOrder) }}</td>

                        <td class="td-5" @click="toChange(order, subOrder)" >
                            {{ getBillWrap(order, subOrder) }} р
                        </td>
                    </tr>
                </td>

                <td class="td-6 td-6-1">
                    <i
                        class="icon far fa-pause-circle"
                        @click="pauseOrder(order)"
                    >
                    </i>
                </td>

                <td class="td-7">
                    <i
                        class="icon far fa-stop-circle"
                        @click="stopOrder(order)"
                    >
                    </i>
                </td>
            </tr>
        </table>

        <Dialog v-if="showDetails" @close="closeDetails">
            <DetailsOrder
                :_order="order"
                :_subOrder="subOrder"
                @close="closeDetails"
                @openResume="openResume($event)"
            />
        </Dialog>


        <Resume
            v-if="showResume"
            :_order="order"
            @close="showResume = false"
        >
        </Resume>
    </div>
</template>

<script>
    import TotalResume   from './TotalResume';
    import stopSubOrder  from './functions/stopSubOrder'
    import DetailsOrder  from  './DetailsOrder/DetailsChangeOrder'
    import Dialog        from  '@/components/Dialog'
    import Icon          from  '@/components/Icon/Icon'

    import getBill       from '@/functions/getBill'
    import getBillAccessories from '@/functions/getBillAccessories'
    import getSale       from '@/functions/getSale'
    import timeFormat    from '@/functions/timeFormat'
    import roundBill     from '@/functions/roundBill'
    import pause         from './functions/pause';

    import copy from '@/functions/copy';


    export default {
        components: {
            Resume: TotalResume,
            DetailsOrder,
            Icon,
            Dialog
        },

        data() {
            return {
                order: null,
                subOrder: null,

                showDetails: false,
                showResume: false,
            }
        },

        methods: {
            ...stopSubOrder,

            toChange(order, subOrder) {
                this.order = order
                this.subOrder = subOrder
                this.showDetails = true
            },

            openResume(e) {
                this.order = e.order
                this.subOrder = e.subOrder
                this.showResume = true
            },

            closeDetails() {
                this.subOrder = null
                this.order = null
                this.showDetails = false
            },

            getStartTime(time) {
                if (!time) {
                    return ''
                }

                const format = (date) => {
                    return date < 10
                        ? `0${date}`
                        : `${date}`
                }

                const today = new Date()
                const todayY = format(today.getFullYear())
                const todayM = format(today.getMonth() + 1)
                const todayD = format(today.getDate())

                const orderDate = new Date(time)
                const orderY = format(orderDate.getFullYear())
                const orderM = format(orderDate.getMonth() + 1)
                const orderD = format(orderDate.getDate())
                const orderH = format(orderDate.getHours())
                const orderMin = format(orderDate.getMinutes())


                return todayD == orderD && todayM == +orderM && todayY == orderY
                    ? `${orderH}:${orderMin}`
                    : `${orderD}.${orderM}.${orderY} \n ${orderH}:${orderMin}`
            },

            getTimePlay(order, subOrder) {
                const start = Date.parse(order.start_time)
                const end   = this.$store.getters.now
                const pause = subOrder.pause_time

                const time = end - start

                if (subOrder.status == "ACTIVE") {
                    if (time && pause) {
                        return timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "PAUSE") {
                    // Товар может находиться в паузе несколько раз
                    // Пауза равна сумме всех времменных интервалов
                    // Последний интервал вычисляется как ВремяСейчас минус ВремяСтартаПоследнейПаузы 

                    const lastPause = Date.now() - +subOrder.pause_start
                    const pause = +subOrder.pause_time + lastPause

                    if (time && pause) {
                        return timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "END") {
                    return timeFormat(Date.parse(subOrder.end_time) - start - pause)
                }
            },

            getBillWrap(order, subOrder) {
                let time;

                if (subOrder.status == "ACTIVE") {
                    time = Date.now() - Date.parse(order.start_time) - subOrder.pause_time;
                }

                if (subOrder.status == "PAUSE") {
                    const lastPause = Date.now() - +subOrder.pause_start;
                    const pause = +subOrder.pause_time + lastPause;

                    time = Date.now() - Date.parse(order.start_time)- pause;
                }

                if (subOrder.status == "END") {
                    time = Date.parse(subOrder.end_time) - Date.parse(order.start_time);
                }

                const billRent = getBill(subOrder.tariff_id, time);
                const billAccess = getBillAccessories(subOrder.accessories, this.$store.getters.accessories, billRent);

                const customer = this.$store.getters.customers.find(i => i.id_rent == order.customer_id);
                const sale = getSale(billRent + billAccess, customer);

                // return roundBill(billWithSale)
                return roundBill(billRent) + roundBill(billAccess) - roundBill(sale);
            },

            pauseOrder(order) {
                // Если в ордере есть активные сабордеры - делаем паузу для всех активных 
                // Если нету, снимаем все с паузы

                const _subOrders = this.$store.getters.activeSubOrders.filter(i => {
                    return i.order_id === order.id_rent;
                });
                const subOrders = copy(_subOrders);

                if (subOrders.length === 0) {
                    return false;
                }

                const activeList = subOrders.filter( i => i.status === "ACTIVE");
                const pauseList  = subOrders.filter( i => i.status === "PAUSE");

                const makePause = () => {
                    return activeList.map(i => {
                        return { cmd: 'changeSubOrder', value: pause(i) };
                    });
                };
                const makeActive = () => {
                    return pauseList.map(i => {
                        return { cmd: 'changeSubOrder', value: pause(i) };
                    });
                };

                const cmds = activeList.length > 0 ? makePause() : makeActive();

                cmds.push({ cmd: 'getActiveSubOrders' });

                this.$store.dispatch('multipleRequest', cmds);
            },

            stopOrder(order) {
                this.order = order;
                this.showResume = true;
            },

            getTitle(order) {
                const customers = this.$store.getters.customers
                const customer = customers.find(i => i.id_rent == order.customer_id)
                const note = order.note ? order.note : ''

                const getName = (customer) => {
                    if (!customer) {
                        return '';
                    }

                    const f = customer.fname ? customer.fname : '';
                    const s = customer.sname ? customer.sname[0] + '.' : '';
                    const t = customer.tname ? customer.tname[0] + '.' : '';

                    return `${ f } ${ s } ${ t }`;
                };

                return customer ? getName(customer) + ' ' + customer.phone : `${note}`;
            },

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            },
            getExtAccessories(idUsedAccessories) {
                if (!idUsedAccessories) {
                    return [];
                }

                const split = idUsedAccessories.split(','); // [1, 2]
                const trim = split ? split.map(i => i.trim()) : [];

                const accessories = trim.map(i => {
                    i = this.$store.getters.accessories.find(j => j.id_rent === i);
                    return i;
                });

                const icons = accessories.map(i => {
                    const firstSymbol = i.name ? i.name[0] : '';
                    return firstSymbol;
                });

                return icons;
            },

        },

        computed: {
            orders() {
                this.$store.getters.activeCategory; // обновление при смене категории. Косяк.

                return this.$store.getters.activeOrders.reduce((acc, order) => {
                    order.format_start_time = this.getStartTime(order.start_time);
                    order.title = this.getTitle(order);

                    const subOrders = this.$store.getters.activeSubOrders.filter(i => i.order_id === order.id_rent);

                    const modifySubOrders = subOrders.map(subOrder => {
                        subOrder.product_name = this.getProductName(subOrder.product_id);
                        subOrder.extAccessories = this.getExtAccessories(subOrder.accessories);

                        return subOrder;
                    });

                    order.subOrders = modifySubOrders;

                    acc.push(order);

                    return acc;
                }, []);
            },
            ordersByCategory() {
                const isBelongsCategory = (subOrder) => {
                    const product = this.$store.getters.products.find(i => i.id_rent === subOrder.product_id);
                    const activeCategory = this.$store.getters.activeCategory;

                    return product.category === activeCategory.id_rent;
                };

                return this.orders.reduce((acc, order) => {
                    const modifySubOrders = order.subOrders.filter(i => isBelongsCategory(i));

                    if (modifySubOrders.length === 0) {
                        return acc;
                    }

                    order.subOrders = modifySubOrders;

                    acc.push(order);
                    return acc;
                }, []);
            },
            length() {
                let count = 0;
                const orders = this.ordersByCategory;

                for (let i = 0; i < orders.length; i +=1) {
                    const subOrders = orders[i].subOrders;

                    for (let j = 0; j < subOrders.length; j +=1) {
                        count += 1;
                    }
                }

                return count;
            }
        }
    };
</script>

<style lang="sass" scoped>
    .order-list 
        min-width: 400px
        padding: 10px
    

    .icon 
        opacity: 0.2
        text-align: center
    
    .icon:hover 
        opacity: 1
        cursor: pointer
    

    .icon__active 
        opacity: 1
    

    .table td 
        padding: 5px
        box-sizing: border-box
        border-collapse: collapse
        border: none
        margin: 0
    

    .table-tr > td 
        border-bottom: 1px solid #333
    


    .table-tr:nth-child(2n - 1) 
        background-color: rgba(0,0,0,0.01)
    

    .table th 
        text-align: center
    
    .td-1 
        width: 20px
    
    .td-2 
        width: 100px
        text-align: center
    
    .td-3 
        width: 240px
    
    .td-4 
        width: 100px
    
    .td-5 
        width: 70px
        text-align: right
    
    .td-6 
        width: 10px
    
    .td-7 
        width: 15px
    

    .product_name:hover 
        text-decoration: underline
        cursor: pointer
    
    .product-tr 
        border-bottom: 1px solid transparent
    
    .product-tr:hover 
        cursor: pointer
        border-bottom: 1px solid rgba(255, 255, 255, 0.8)
    

    .suborder--pause 
        color: rgba(255, 255, 255, 0.5)
    
</style>