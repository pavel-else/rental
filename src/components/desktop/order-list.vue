<template>
    <div class="order-list">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>

        <table cellspacing="0" class="table">
            <tr 
                class="table-tr" 
                v-for="(order, index) in orders"
                :key="order.order_id"
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
                        <td class="td-3" @click="changeOrder(subOrder.id)" >{{ getProductName(subOrder.product_id) }}</td>

                        <td class="td-4" @click="changeOrder(subOrder.id)" >{{ getTimePlay(order.start_time, subOrder.end_time) }}</td>

                        <td class="td-5" @click="changeOrder(subOrder.id)" >
                            {{ getBill(subOrder.tariff_id, getTime(order.start_time, subOrder.end_time)) }} р
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
                        <td class="td-6 td-6-2">                            
                            <i 
                                class="icon far fa-stop-circle"
                                :class="{ icon__active: subOrder.end_time }"
                                @click="stopOrder(order, subOrder)" 
                            >
                            </i>                          
                        </td>
                    </tr>
                </td>

                <td class="td-7">
                    <!-- <i 
                         class="icon far fa-stop-circle"
                         @click="stopOrder(order)" 
                     >
                     </i>  -->  
                </td>              
            </tr>
        </table>

        <DetailsOrder 
            v-if="showDetails" 
            :data-sub-order="subOrder" 
            @close="closeDetails"
        >
        </DetailsOrder>

        <Resume :order="order" @close="onClose" v-if="showResume"></Resume>
    </div>
</template>

<script>
    import Resume       from './Resume'
    import DetailsOrder from  './DetailsOrder/DetailsOrder'
    import Icon         from  './Icon/Icon'

    import getBill    from '../../functions/getBill'
    import timeFormat from '../../functions/timeFormat'
    import getTime    from '../../functions/getTime'

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
            ...getBill,
            ...getTime,
            ...timeFormat,

            changeOrder(id) {
                this.subOrder = {id}
                this.showDetails = true
            },

            closeDetails() {
                this.subOrder = null
                //this.order = null
                this.showDetails = false
            },

            getTimePlay(start, end) {
                const time = this.getTime(start, end)
                return this.timeFormat(time)
            },

            pause(subOrder) {
                if (subOrder.status != 'ACTIVE' && subOrder.status != 'PAUSE') {
                    console.log('unknown status - ', subOrder.status)
                    return
                }

                const makePause = () => {
                    subOrder.status = "PAUSE"
                    subOrder.pause_start = Math.floor(Date.now() / 1000)         
                }

                const makeActive = () => {
                    subOrder.status = "ACTIVE"

                    const sec = Math.floor((Date.now() - Date.parse(subOrder.pause_start)) / 1000)

                    subOrder.pause_time = +subOrder.pause_time + sec

                    subOrder.pause_start = null
                }

                subOrder.status == "ACTIVE" ? makePause() : makeActive()


                this.$store.dispatch('send', {
                    cmd: 'changeOrderProduct',
                    value: subOrder
                })
            },

            stopOrder(order, product) {
                /*
                * Функция принимает ордер и id продукта, ставит временнУю метку стопа,
                * прописывает стоимость и отправляет на сервер.
                * Если id продукта не указан, то функция остановки применяется для всех активных ордеров
                */

                if (!order) {
                    return false
                }

                const stop = (product) => {
                    // const product = order.products.find(p => p.product_id == product_id)

                    product.end_time = Math.floor(Date.now() / 1000)
                    product.bill = this.getBill(product.tariff_id, this.getTime(order.start_time, product.end_time))
                    product.status = "END"

                    this.$store.dispatch('send', {
                        cmd: 'stopOrder',
                        value: product
                    })

                    this.showResume = true
                    this.order = order
                }

                const stopAll = () => {
                    const products = this.getSubOrders(this.order.order_id).filter(p => p.end_time == null)

                    products.map(p => stop(p))
                }

                this.order = order
                return product ? stop(product) : stopAll()                
            },

            onClose() {
                this.order = null
                this.showResume = false
            },

            getSubOrders(order_id) {
                const subOrders = this.$store.getters.orderProducts

                return subOrders ? this.$store.getters.orderProducts.filter(i => i.order_id == order_id) : []   
            },

            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent == product_id)

                return product.name
            }

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
        opacity: 0.1;
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