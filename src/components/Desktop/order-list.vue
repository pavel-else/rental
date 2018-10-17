<template>
    <div class="order-list">
        <h3>В прокате <span v-if="countActiveSubOrders">({{ countActiveSubOrders }})</span></h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>

        <table cellspacing="0" class="table">
            <tr 
                class="table-tr" 
                v-for="order in orders"
                :key="order.order_id"
                v-if="subOrders[order.order_id]"
                :title="order.title"
            >
                <td class="td-1">
                    <Icon :id="order.order_id_position" :show="true"></Icon>
                </td>

                <td class="td-2">{{ order.format_start_time }}</td>

                <td>
                    <tr 
                        class="product-tr"
                        v-for="subOrder in subOrders[order.order_id]" 
                        :key="subOrder.id_rent" 
                        :class="subOrder.status === 'PAUSE' ? 'suborder--pause' : 'suborder--active'"
                    >
                        <td class="td-3" @click="toChange(order, subOrder)" >{{ subOrder.product_name }}</td>

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

        <DetailsOrder 
            v-if="showDetails" 
            :dataOrder="order" 
            :dataSubOrder="subOrder" 
            @close="closeDetails"
            @openResume="openResume($event)"
        >
        </DetailsOrder>

        <Resume :_order="order" :_subOrder="subOrder" @close="onClose" v-if="showResume"></Resume>
    </div>
</template>

<script>
    import Resume        from './Resume'
    import stopSubOrder  from './functions/stopSubOrder'
    import DetailsOrder  from  './DetailsOrder/DetailsChangeOrder'
    import Icon          from  '../Icon/Icon'

    import getBill       from '../../functions/getBill'
    import timeFormat    from '../../functions/timeFormat'
    import roundBill     from '../../functions/roundBill'
    import pause         from './functions/pause'


    export default {
        components: {
            Resume,
            DetailsOrder,
            Icon
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
            ...timeFormat,
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
                        return this.timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "PAUSE") {
                    // Товар может находиться в паузе несколько раз
                    // Пауза равна сумме всех времменных интервалов
                    // Последний интервал вычисляется как ВремяСейчас минус ВремяСтартаПоследнейПаузы 

                    const lastPause = Date.now() - +subOrder.pause_start
                    const pause = +subOrder.pause_time + lastPause

                    if (time && pause) {
                        return this.timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "END") {                   
                    return this.timeFormat(Date.parse(subOrder.end_time) - start - pause)
                }
            },

            getBillWrap(order, subOrder) {
                let time
                
                if (subOrder.status == "ACTIVE") {
                    time = Date.now() - Date.parse(order.start_time) - subOrder.pause_time
                }

                if (subOrder.status == "PAUSE") {
                    time = subOrder.pause_start - Date.parse(order.start_time)
                }

                if (subOrder.status == "END") {
                    time = Date.parse(subOrder.end_time) - Date.parse(order.start_time)
                }


                return roundBill(getBill(subOrder.tariff_id, time))
            },

            pauseOrder(order) {
                // Если в ордере есть активные сабордеры - делаем паузу для всех активных 
                // Если нету, снимаем все с паузы

                const subOrders = this.$store.getters.subOrders.filter(i => {
                    return i.order_id === order.order_id
                })

                if (subOrders.length === 0) {
                    return
                }

                const activeList = subOrders.filter( i => i.status === "ACTIVE")
                const pauseList  = subOrders.filter( i => i.status === "PAUSE")

                const makePause = () => {
                    return activeList.map(i => {
                        pause(i)
                        return {cmd: 'changeSubOrder', value: i}
                    })
                }
                const makeActive = () => {
                    return pauseList.map(i => {
                        pause(i)
                        return {cmd: 'changeSubOrder', value: i}
                    })
                }

                const cmds = activeList.length ? makePause() : makeActive()
                
                this.$store.dispatch('send', cmds)
            },

            stopOrder(order) {
                const subOrders = this.getSubOrders(order.order_id)


                for (let i = subOrders.length - 1; i >= 0; i--) {
                    this.stopSubOrder(order, subOrders[i], /*send=*/true)
                }

                this.order = order
                this.subOrder = subOrders[0]
                this.showResume = true           
            },

            onClose() {
                this.order = null
                this.showResume = false
            },

            getSubOrders(order_id) {
                return this.$store.getters.subOrders.filter(i => {
                    return i.order_id === order_id && (i.status === "ACTIVE" || i.status === "PAUSE")
                })   
            },

            getTitle(order) {
                const customers = this.$store.getters.customers
                const customer = customers.find(i => i.id_rent == order.customer_id)
                const note = order.note ? order.note : ''

                return customer 
                    ? `${customer.fname} ${customer.sname[0]}. ${customer.tname[0]}. ${customer.phone} ` 
                    : `${note}`
            },

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            },
        },

        computed: {
            /**
            * Каждый раз при ререндеринге компонента будут вызываться все методы, обозначенные в шаблоне.
            * С точки зрения оптимизации, лучше сразу при создании просчитывать свойства объекта
            */
            orders() {
                return this.$store.getters.orders.reduce((acc, i) => {
                    i.format_start_time = this.getStartTime(i.start_time)
                    i.title = this.getTitle(i)

                    acc[i.order_id] = i
                    return acc
                }, {})
            },
            subOrders() {
                // Возвращает объект массивов, где ключ - order_id, массив - subOrders
                const check = item => {

                    return this.orders[item.order_id]
                        && (item.status === "ACTIVE" || item.status === "PAUSE")
                        ? true
                        : false
                }

                return this.$store.getters.subOrders.reduce((acc, item) => {
                    if (!check(item)) {
                        return acc
                    }

                    item.product_name = this.getProductName(item.product_id)
                    
                    acc[item.order_id] ? acc[item.order_id].push(item) : acc[item.order_id] = [item]
                    return acc
                }, {})
            },

            countActiveSubOrders() {
                let length = 0
                for (let i in this.subOrders) {
                    length += this.subOrders[i].length
                }
                return length
            },

            products() {
                return this.$store.getters.products
            },
        }
    }
</script>

<style scoped>
    .order-list {
        width: 480px;
    }

    .empty {
        padding: 0 20px;
    }

    .icon {
        opacity: 0.2;
        text-align: center;  
    }
    .icon:hover {
        opacity: 1;
        cursor: pointer;
    }

    .icon__active {
        opacity: 1;
    }

    .table td {
        padding: 5px;
        box-sizing: border-box;
        border-collapse: collapse;
        border: none;
        margin: 0;
    }

    .black .table-tr > td {
        border-bottom: 1px solid #333;        
    }
    .white .table-tr > td {
        border-bottom: 1px solid lightgray;        
    }

    .table-tr:nth-child(2n - 1) {
        background-color: rgba(0,0,0,0.01);
    }

    .table th {
        text-align: center;
    }
    .td-1 {
        width: 20px;
    }
    .td-2 {
        width: 100px;
        text-align: center;
    }
    .td-3 {
        width: 240px;
    }
    .td-4 {
        width: 90px;
    }
    .td-5 {
        width: 70px;
        text-align: right;
    }
    .td-6 {
        width: 10px;
    }
    .td-7 {
        width: 15px;
    }

    .product_name:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .product-tr {
        border-bottom: 1px solid transparent;
    }
    .product-tr:hover {
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.8);
    }

    .suborder--pause {
        color: rgba(255, 255, 255, 0.5);
    }
</style>