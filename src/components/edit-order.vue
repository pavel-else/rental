<!-- <template>
    <form action="" class="show-modal">
        <h3 class="show-modal__caption">Добавление нового ордера проката</h3>
        <table class="table table-bordered">
            <tr>
                <td>Товар</td>
                <td>{{ product.name}}</td>
            </tr>
            <tr>
                <td>ID</td>
                <td>
                    <select name="" id="" @change="onChange">
                        <option>{{ options.new_order_id }}</option>
                        <option :value="item" v-for="item in ordersList">{{ item }}</option>
                    </select>
                    <span v-if="showNew">(Новый){{ options.new_order_id }}</span>
                </td>
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
</template> -->
<template>
    <form action="" class="show-modal">
        <h3 class="show-modal__caption">Добавление нового ордера проката</h3>

        <table class="table table-bordered">
            <tr>
                <td>Товар</td>
                <td>{{ product.name }}</td>
            </tr>
            <tr>
                <td>ID</td>
                <td>
                    <select name="" id="" @change="onChange">
                        <option>{{ options.new_order_id }}</option>
                        <option :value="item" v-for="item in ordersList">{{ item }}</option>
                    </select>
                    <span v-if="showNew">(Новый){{ options.new_order_id }}</span>
                </td>
            </tr>
            <tr>
                <td>Клиент</td>
                <td>
                    <select v-model="selectCustomerID" name="customer-list" class="customer__select-list">
                        <option  
                            v-for="item in customers"
                            :value="item.id"                                
                        >
                            {{ item.fname }} {{ item.sname }}
                        </option>
                    </select>
                    <span v-if="selectCustomerID">ID: {{ selectCustomerID }}</span>
                </td>
            </tr>
        </table>
        <div class="show-modal__button-group">
            <button type="button">Печать</button>
            <button type="submit" @click.prevent="setOrder">ОК</button>
            <button type="button" @click="closeModal">Отмена</button>
        </div>
    </form>
</template>

<script>
	export default {
		name: 'editOrder',

        props: {
            product: Object,
            orders: Array,
            customers: Array,
            options: Object, // max_order_id,
        },

        data() {
            return {
                selectCustomerID: 0, // 0 - default
                showNew: true,
            }
        },

        computed: {
            ordersList() {
                let result = [];
                if (this.orders) {
                    for (let i = 0; i < this.orders.length; i++) {
                        result.push(this.orders[i].order_id);
                    }
                }

                return result;
            },
            selectOrderID() {
                return this.options.new_order_id
            }
        },

        methods: {
            onChange(e) {
                if (e.target.value == this.options.new_order_id) {
                    this.showNew = true;
                } else {
                    this.showNew = false;
                }
                console.log(e.target.value)
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

                order.order_id = this.selectOrderID;
                order.products = [this.product.id];
                order.customer_id = this.selectCustomerID;
                order.start_time = Math.floor(Date.now() / 1000);

                this.$emit("set", order);
            },
            closeModal() {
                this.$emit("close")
            },
        },
	}
</script>

<style>
    .show-modal {
        width: 400px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        position: absolute;
        left: calc(50% - 200px);
        top: 100px;
        background-color: #fff;
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>