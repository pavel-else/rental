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
                <td>{{ item.name }}</td>
            </tr>
        </table>
    </div>
    `
})

Vue.component('order-list', {
    props: {
        orders: Array,
        now: null,
        productsAll: Array,
    },
    methods: {
        timeFormat (ms/**number*/){
            if (ms < 0) ms = 0;

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
        getProductsName(id) {
            // Это все дико не оптимально
            for (let i = 0; i < this.productsAll.length; i++) {
                if (this.productsAll[i].id_rent == id) return this.productsAll[i].name;
            }
        }
    },

    template: `
        <div class="snippet snippet__orders">
            <h3>В прокате</h3>
            <table class="table table-bordered">
                <tr>
                    <th class="ord__td-1">№</th>
                    <th class="ord__td-2">ID</th>
                    <th class="ord__td-3">Товар</th>
                    <th class="ord__td-4"></th>
                    <th class="ord__td-5">Старт</th>
                    <th class="ord__td-6">В прокате</th>
                </tr>
            </table>
            <table class="table table-bordered">

                <tr v-for="(item, index) in orders" @click="unset(item, index)">
                    <td class="ord__td-1">{{ index + 1 }}</td>
                    <td class="ord__td-2">{{ item.order_id }}</td>
                    <td>
                        <tr v-for="(sbitem, index) in item.products">
                            <td class="ord__td-3">{{ sbitem.product_id }}</td>
                            <td class="ord__td-4">{{ getProductsName(sbitem.product_id) }}</td>
                            <td class="ord__td-5">{{ item.start_time }}</td>
                            <td class="ord__td-6">{{ getTimePlay(item.start_time, item.timeDelay) }}</td>
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
        product: Object,
        options: Object,
        position: Number, //Позиция в массиве, для последующего удаления из <product-list>
    },
    data() {
        return {
            selectCustomerID: 0, // 0 - default
        }
    },
    methods: {
        order_id() {
            return +this.options.max_order_id + 1;
        },
        setOrder() {
            let order = {
                accessories: '',
                advance: 0, //Сумма предоплаты
                advance_hold: false,
                advance_time: 0,
                bill: 0,
                bill_no_sale: null,
                customer_id: Number,
                customer_name: '',
                end_time: '',
                id: Number,
                id_rental_org: "8800000001",
                note: '',
                order_id: Number,
                play_pause: true,
                products: Array,
                sale_id: '',
                start_time: String,
                status: String,
            }

            order.status = 'ACTIVE';

            order.order_id = ++this.options.max_order_id;
            order.products = [this.product.id];
            order.customer_id = this.selectCustomerID;
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
                    <td>{{ order_id() }}</td>
                </tr>
                <tr>
                    <td>Аванс</td>
                    <td><input type="text"></td>
                </tr>
                <tr>
                    <td>Клиент</td>
                    <td>
                        <select v-model="selectCustomerID" name="customer-list" class="customer__select-list">
                            <option 
                                value="" 
                                v-for="item in customers"
                                :value="item.id"                                
                            >
                                {{ item.fname }} {{ item.sname }}
                            </option>
                        </select>
                        <span v-if="selectCustomerID">ID: {{ selectCustomerID }}</span>
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

        productPosition: Number,

        showOrderModal: false,
    },

    methods: {
        closeModal() {
            this.showOrderModal = false;
        },
        toEdit(item, index) {
            this.productPosition = index;

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
            this.getData(['getProducts', 'getOrders', 'getMaxOrderID', 'getLogs'], response => {
                this.options = response.data.options;           
                this.productsAll = response.data.products;
                this.products = this.filterProducts(this.productsAll);
                this.orders = response.data.orders; 
                this.logs = response.data.logs;
                //console.log(this.products);          
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

            this.setData('getOrderID', '776', response => {
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
})