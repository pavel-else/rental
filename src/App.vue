<template>
    <div id="app">
        <h1>hell0)</h1>
    </div>
</template>

<script>
export default {
    name: 'app',

    data () {
        return {
            msg: 'Welcome to Your Vue.js App',

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

            showOrderModal: false,
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

    created() {
        //Запрос данных для инициализации и обновления компонентов приложения
        this.update();

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
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
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
