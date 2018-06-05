Vue.component('product-list', {
    props: {
        products: Array
    },
    methods: {
        toEdit(item, index) {
            this.$emit("edit", item, index);
        }
    },
    template: `
    <div class="snippet snippet__products">
        <h3>Свободные</h3>
        <table class="table table-bordered">
            <tr>
                <th>№</th>
                <th>Товар</th>
            </tr>
            <tr v-for="(item, index) in products" @click="toEdit(item, index)">
                <td>{{ index + 1}}</td>
                <td>{{ item.name}}</td>
                <td>{{item.id}}</td>
            </tr>
        </table>
    </div>
    `
})

Vue.component('order-list', {
    props: {
        orders: Array,
        now: null,
    },
    methods: {
        timeFormat (ms/**number*/){
            if (ms < 0) {
                ms = 0;
            }
            function num(val){
                val = Math.floor(val);
                return val < 10 ? '0' + val : val;
            }
            
            var sec = ms / 1000
              , hours = sec / 3600  % 24
              , minutes = sec / 60 % 60
              , seconds = sec % 60
            ;

            return num(hours) + ":" + num(minutes) + ":" + num(seconds);
        },
        getTimePlay(time, delay) {
            var date = new Date(time);
            var now = new Date(this.now);
            return this.timeFormat(now - date);
        },
        getOrderProducts(id) {
            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/request.php',
                data: {
                    cmds: 'getOrderProducts',
                    value: id,
                }
            })
            .then(response => {
                console.log(response.data)
            })
        }

    },

    template: `
        <div class="snippet snippet__orders">
            <h3>В прокате</h3>
            <table class="table table-bordered">
                <tr>
                    <th>№</th>
                    <th>ID</th>
                    <th>Id товара</th>
                    <th>Старт</th>
                    <th>В прокате</th>
                </tr>

                <tr v-for="(item, index) in orders" @click="unset(item, index)">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.order_id }}</td>
                    <td>{{ item.product_id }}
                        <tr v-for="(sbitem, index) in item.products">
                            <td>{{ sbitem.product_id }}</td>
                            <td>{{ item.start_time }}</td>
                            <td>{{ getTimePlay(item.start_time, item.timeDelay) }}</td>
                        </tr>
                    </td>
                </tr>
            </table>
        </div>
    `
})

Vue.component('edit-order', {
    props: {
        customers: Array,
        productName: String,
        product: Object,
        position: Number, //Позиция в массиве, для последующего удаления из <product-list>
    },
    methods: {
        setOrder() {
            let order = {
                accessories: '',
                advance: 0, //Сумма предоплаты
                advance_hold: false,
                advance_time: 0,
                bill: 0,
                bill_no_sale: null,
                customer_id: Number,
                customer_name: "Кравцова Лолита Александровна",
                end_time: '',
                id: Number,
                id_rental_org: "8800000001",
                note: '',
                order_id: Number,
                play_pause: true,
                products: [18],
                sale_id: '',
                start_time: String,
                status: String,

                timeDelay: 120000, //Number, ms
            }

            order.status = 'ACTIVE';
            order.customer_id = 531;
            order.order_id = 777;
            order.products = [this.product.id];

            order.start_time = Math.floor(Date.now() / 1000);
            this.$emit("set", order, this.position);
        },

        closeModal() {
            this.$emit("close")
        },
    },
    template: `
        <form action="" class="show-modal">
            <h3 class="show-modal__caption">Добавление нового ордера проката</h3>
            <table class="table table-bordered">
                <tr>
                    <td>Товар</td>
                    <td>{{ product.name}}</td>
                </tr>
                <tr>
                    <td>ID</td>
                    <td>001</td>
                </tr>
                <tr>
                    <td>Аванс</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>

                        <select name="customer-list" class="customer__select-list">
                            <option value="" v-for="(item) in customers">{{item.fname}} {{item.sname}}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Залог</td>
                    <td>
                        <select>
                          <option value="">Паспорт</option>
                          <option value="">Права</option>
                          <option value="">Еще</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Примечание</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Акция</td>
                    <td>
                        <select>
                          <option value="">Новый Год</option>
                          <option value="">Студент</option>
                          <option value="">Еще</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Аксессуары</td>
                    <td>
                        <select>
                          <option value="">Кресло</option>
                          <option value="">Шлем</option>
                          <option value="">Еще</option>
                        </select>
                    </td>
                </tr>
            </table>

            <div class="show-modal__button-group">
                <button type="button">Печать</button>
                <button type="submit" @click.prevent="setOrder">ОК</button>
                <button type="button" @click="closeModal">Отмена</button>
            </div>
        </form>
    `,
}); 

new Vue({
    el: '#app',
    data: {
        now: Date,
        logs: '',
        orders: [],
        product: {},
        products: [],
        customers: [],
        order_products: {},

        product: {},
        productName: '',
        productPosition: Number,

        showOrderModal: false,
    },

    methods: {
        closeModal() {
            this.showOrderModal = false;
        },
        toEdit(item, index) {
            this.productName = item.name;
            this.productPosition = index;

            this.product = item;

            this.showOrderModal = true;
        },
        setOrder(order) {
            this.orders.push(order);
            this.setData('setOrder', order, response => {
                console.log(response.data);
            });
            // console.log(order);
            this.products.splice(this.productPosition, 1);  
            this.showOrderModal = false;
        },
        unset(item, index) {
            this.products.push(item);
            this.orders.splice(index, 1);
        },
        getData(cmds, callback) {
            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/request.php',
                data: {
                    cmds: cmds,
                }
            })
            .then(callback)
        },
        setData(cmd, value, callback) {
            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/request.php',
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

            this.getData('test', response => {
                console.log(response.data)
            })
        }
    },
    created() {
        //Запрос данных для инициализации приложения
        this.getData(['getProducts', 'getOrders', 'getLogs'], response => {
            this.products = response.data.products;
            this.orders = response.data.orders;            
            this.logs = response.data.logs;
            console.log(response.data);          
        })

        // this.setData('getOrderProducts', '777', response => {
        //     this.order_products = response.data.order_products;
        //     console.log(this.order_products);
        // })

        // Обновление таймеров
        setInterval(() => {this.now = new Date()}, 1000)
    },
    mounted() {
        this.getData(['getClients'], response => {
            this.customers = response.data.clients;
        })
    }
})