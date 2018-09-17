<template>
    <div class="order-list">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>

        <table cellspacing="0" class="table">
            <tr 
                class="table-tr" 
                v-for="(order, index) in orders"
                v-if="getSubOrders(order.order_id).length"
                :title="title(order.customer_id)"
            >
                <td class="td-1">
                    <Icon :id="order.order_id_position" :show="true"></Icon>
                </td>

                <td class="td-2">{{ order.start_time }}</td>

                <td>
                    <tr 
                        class="product-tr"
                        v-for="subOrder in getSubOrders(order.order_id)" 
                        :key="subOrder.product_id" 
                                              
                    >
                        <td class="td-3" @click="toChange(order, subOrder)" >{{ getProductName(subOrder.product_id) }}</td>

                        <td class="td-4" @click="toChange(order, subOrder)" >{{ getTimePlay(order, subOrder) }}</td>

                        <td class="td-5" @click="toChange(order, subOrder)" >
                            {{ getBill(order, subOrder) }} р
                        </td>                          

                        <td class="td-6 td-6-1">
                            <i 
                                class="icon far fa-pause-circle"
                                :class="{ icon__active: subOrder.status == 'PAUSE' }"
                                @click="pause(subOrder)" 
                                v-if="!subOrder.end_time"
                            >
                            </i>
                        </td>
<!--                         <td class="td-6 td-6-2">                            
                            <i 
                                class="icon far fa-stop-circle"
                                :class="{ icon__active: subOrder.end_time }"
                                @click="stopOrder(order, subOrder)" 
                            >
                            </i>                          
                        </td> -->
                    </tr>
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
        >
        </DetailsOrder>

        <Resume :_order="order" :_subOrder="subOrder" @close="onClose" v-if="showResume"></Resume>
    </div>
</template>

<script>
    import Resume        from './Resume'
    import stopSubOrder  from './functions/stopSubOrder'
    import DetailsOrder  from  './DetailsOrder/DetailsChangeOrder'
    import Icon          from  './Icon/Icon'

    import calculateBill from '../../functions/calculateBill'
    import billAccess    from '../../functions/billAccess'
    import timeFormat    from '../../functions/timeFormat'
    import getTime       from '../../functions/getTime'
    import roundBill     from '../../functions/roundBill'

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

                cmd: null
            }
        },

        methods: {
            ...getTime,
            ...timeFormat,
            ...calculateBill,
            ...billAccess,
            ...stopSubOrder,

            toChange(order, subOrder) {
                this.order = order
                this.subOrder = subOrder
                this.showDetails = true
            },

            closeDetails() {
                this.subOrder = null
                this.order = null
                this.showDetails = false
            },

            getTimePlay(order, subOrder) {
                const start = Date.parse(order.start_time)
                const end   = this.$store.getters.options.now
                const pause = subOrder.pause_time

                const time = end - start

                if (subOrder.status == "ACTIVE") {
                    if (time && pause) {
                        return this.timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "PAUSE") {
                    const oldPause = subOrder.pause_time
                    const newPause = Date.now() - Date.parse(subOrder.pause_start)
                    const pause = +oldPause + newPause
                    //console.log(time - pause)

                    if (time && pause) {
                        return this.timeFormat(time - pause)
                    }
                }

                if (subOrder.status == "END") {                   
                    return this.timeFormat(Date.parse(subOrder.end_time) - start - pause)
                }
            },

            getBill(order, subOrder) {
                let time
                
                if (subOrder.status == "ACTIVE") {
                    time = Date.now() - Date.parse(order.start_time) - subOrder.pause_time
                }

                if (subOrder.status == "PAUSE") {
                    time = Date.parse(subOrder.pause_start) - Date.parse(order.start_time)
                }

                if (subOrder.status == "END") {
                    time = Date.parse(subOrder.end_time) - Date.parse(order.start_time)
                }


                return roundBill(this.calculateBill(subOrder.tariff_id, time))
            },

            pause(subOrder) {
                if (subOrder.status != 'ACTIVE' && subOrder.status != 'PAUSE') {
                    console.log('unknown status - ', subOrder.status)
                    return
                }

                const makePause = () => {
                    subOrder.status = "PAUSE"
                    subOrder.pause_start = Date.now() / 1000        
                }

                const makeActive = () => {
                    subOrder.status = "ACTIVE"

                    const pause = Date.now() - Date.parse(subOrder.pause_start)
                    console.log(pause)

                    subOrder.pause_time = +subOrder.pause_time + pause

                    subOrder.pause_start = null

                    console.log(subOrder)
                }

                subOrder.status == "ACTIVE" ? makePause() : makeActive()


                this.$store.dispatch('send', {
                    cmd: 'changeOrderProduct',
                    value: subOrder
                })
            },

            stopOrder(order) {
                const subOrders = this.getSubOrders(order.order_id)


                for (let i = subOrders.length - 1; i >= 0; i--) {
                    this.stopSubOrder(order, subOrders[i], true)
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

            title(customer_id) {
                const customers = this.$store.getters.customers
                const customer = customers.find(i => i.id_rent == customer_id)

                return customer ? `${customer.fname} ${customer.sname[0]}. ${customer.tname[0]}.  ${customer.phone}` : 'Клиент не указан'
            },

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            },

            getAccessories(subOrder) {
                if (!subOrder.accessories) {
                    return null
                }

                const split = subOrder.accessories.split(',') // [1, 2]

                return split.map(i => {
                    return this.$store.getters.accessories.find(j => j.id_rent == i)
                })
            },
        },

        computed: {
            orders() {
                return this.$store.getters.orders
            },
            products() {
                return this.$store.getters.products
            },
        }
    }
</script>

<style scoped>
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
        width: 80px;
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
</style>