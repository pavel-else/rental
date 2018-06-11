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
                <td class="id-buttons">
                    <div v-if="showIDButtons" @click="showIDButtons = !showIDButtons" class="idbtn idbtn_once"><div></div></div>
                    <div v-else class="idbtn idbtn_groupe">
                        <div 
                            v-for="item in order_id_position_list"
                            :class="{empty: item.order_id}"
                            @click="onClick(item)"
                        >{{ item.id }}</div>                      
                    </div>
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
                showIDButtons: true, //true - default

                selectCustomerID: null,
            }
        },

        computed: {
            order_id_position_list() {
                let result = {};

                for (let i = 0; i <= 15; i++) {
                    result[i] = {
                        id: i,
                        order_id: null,
                    }
                }

                for (let i = 0; i < this.orders.length; i++) {
                    result[this.orders[i].order_id_position].order_id = this.orders[i].order_id
                }

                return result
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

            onClick(item) {
                console.log(item);
                this.selectCustomerID = item.order_id;
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

    .idbtn_groupe {
        width: 100px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        border: 1px solid;
    }

    .idbtn div {
        width: 15px;
        height: 15px;
        margin: 4px;

        font-size: 11px;
        text-align: center;

        background-color: #aaa;
    }

    .idbtn div:hover {
        outline: 1px solid #000;
    }

    .empty {
        border: 1px solid red;
    }

</style>