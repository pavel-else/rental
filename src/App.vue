<template> 
    <div id="app"   class="tmp">
        <product-list @edit="toEdit" class="tmp"></product-list>

        <new-order v-if="showNewOrder"></new-order>

        <order-list :now="now" class="tmp"></order-list>
        
        <!-- <test></test> -->
    </div>
</template>

<script>
import axios from 'axios'
import productList from './components/product-list'
import editOrder from './components/edit-order'
import orderList from './components/order-list'
import newOrder from './components/new-order'
import Test from './components/Test'

export default {
    name: 'app',

    components: {
        productList,
        editOrder, 
        orderList,
        newOrder,
        Test
    },

    data () {
        return {
            options: {
                max_order_id: Number,
            },

            now: Date,

            orders: [],
            products: [],
            productsAll: [], 
            customers: [],
            product: {},
            logs: '',
        }
    },

    methods: {
        closeModal() {
            this.showOrderModal = false;
        },

        toEdit(item) {
            this.product = item;
            this.showOrderModal = true;
        },

        setOrder(order) {
            this.setData('setOrder', order, response => {
                console.log(response.data);
                this.update();
            });
 
            this.showOrderModal = false;
        },

        unset(item, index) {
            this.products.push(item);
            this.orders.splice(index, 1);
        },
        update() {
            this.getData(['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs'], response => {
                this.options = response.data.options;           
                this.productsAll = response.data.products;
                this.products = this.filterProducts(this.productsAll);
                this.orders = response.data.orders;
                this.customers = response.data.clients;
                this.logs = response.data.logs;
                console.log(response.data.options.max_order_id);          
            })
        },
        filterProducts(arr) {
            let result = [];

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].active != 0) {
                    result.push(arr[i]);
                }
            }

            return result;
        },
        getData(cmds, callback) {
            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
                data: {
                    cmds: cmds,
                }
            })
            .then(callback)
        },
        setData(cmd, value, callback) {
            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/App/request.php',
                data: {
                    cmds: cmd,
                    value: value,
                }
            })
            .then(callback)
        },

        test() {
            data = {
                id: '155',
                order_id: '777',
                product_id: '16',
                bill: 0,
                bill_no_sale: 0,
                end_time: 0,
            }

            this.setData('getOrderID', '678', response => {
                console.log(response.data)
            })
        }
    },
    computed: {
        showNewOrder() {
            return this.$store.getters.showNewOrder
        }
    },

    created() {
        //Запрос данных для инициализации и обновления компонентов приложения
        this.update();
        this.$store.dispatch('upd', ['getProducts', 'getOrders', 'getMaxOrderID', 'getClients', 'getLogs'])

        // Обновление таймеров
        setInterval(() => {this.now = new Date()}, 1000)
    },

    mounted() {
        this.getData(['getClients'], response => {
            this.customers = response.data.clients;
        })
    }
}
</script>

<style>
    #app {
        display: flex;
        width: 960px;
        margin: 100px auto 0;
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    .tmp {
        outline: 1px solid lightgray;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
