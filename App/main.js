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
            return this.timeFormat(this.now - time);
        }
    },

    template: `
        <div class="snippet snippet__orders">
            <h3>В прокате</h3>
            <table class="table table-bordered">
                <tr>
                    <th>№</th>
                    <th>Товар</th>
                    <th>Старт</th>
                    <th>В прокате</th>
                </tr>
                <tr v-for="(item, index) in orders" @click="unset(item, index)">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.productName }}</td>
                    <td>{{ item.timeStart }}</td>
                    <td>{{ getTimePlay(item.time, item.timeDelay) }}</td>
                </tr>
            </table>
        </div>
    `
})

Vue.component('edit-order', {
    props: {
        customers: Array,
        productName: String,
        position: Number, //Позиция в массиве, для последующего удаления
    },
    methods: {
        setOrder() {
            let order = {
                id: Number,
                productName: String, 
                advance: Number, //Сумма предоплаты
                customerId: Number,
                customerName: String,
                time: Object,
                timeStart: Object,
                timeDelay: 120000, //Number, ms
            }
        
            order.productName = this.productName;

            let time = new Date();
            order.time = time;
            order.timePlay = 0;
            order.timeStart = time.toLocaleString();

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
                    <td>{{ productName }}</td>
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
        products: [],
        customers: [],
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
            this.showOrderModal = true;
        },
        setOrder(order) {
            this.orders.push(order);
            //this.clearOrder();
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
        setData(cmds, value, callback) {

            axios({
                method: 'post',
                url: 'http://overhost.net/rental2/api_v1/ajax/request.php',
                data: {
                    cmds: cmds,
                    value: value,
                }
            })
            .then(callback)
        }
    },
    created() {
        //Запрос данных для инициализации приложения
        this.getData(['getProducts', 'getOrders', 'getLogs'], response => {
            this.products = response.data.products;
            this.orders = response.data.orders;
            this.logs = response.data.logs;
            // console.log(this.logs);
        })

        // Обновление таймеров
        setInterval(() => {this.now = new Date()}, 1000)
    },
    mounted() {
        this.getData(['getClients'], response => {
            this.customers = response.data.clients;
        })
    }
})