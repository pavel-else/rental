<template>
    <div class="customer-id">
        <div class="btn" v-if="show" @click="show=!show">{{ select }}</div>
        <div class="btns tmp" v-else>
            <div 
                v-for="(item, index) in btns"
                class="btn"
                :class="{active: item.position, select: select == index}"
                @click="onClick(item, index)"
            >
                {{item.position}}
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'customerId',
        data() {
            return {
                show: true,
                select: null,
                result: []
            }
        },
        methods: {
            onClick(item, index) {
                this.select = item.position

                item.position = index
                this.$store.dispatch('selectOrderId', item)
                
                this.show = !this.show
            }
        },

        computed: {
            orders() {  
                return this.$store.getters.orders
            },
            btns() {
                const result = []
                const orders = this.$store.getters.orders
                const newId = this.$store.getters.options.new_order_id

                for (let i = 0; i <= 15; i++) {
                    result[i] = {
                        position: null,
                        order_id: newId
                    }
                }

                for (let i = 0; i < orders.length; i++) {
                    let index = orders[i].order_id_position;

                    result[index].position = index
                    result[index].order_id = orders[i].order_id
                }
                
                return result
            },
        }
    }
</script>

<style>
    .btns {
        width: 80px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .btn {
        width: 15px;
        height: 15px;
        background-color: #eee;
        box-sizing: border-box;
        margin: 2px;
        font-size: 12px;
        text-align: center;
    }
    .btn:hover {
        outline: 1px solid red;
        cursor: pointer;
    }
    .active {
        outline: 1px solid red;
    }
    .select {
        background-color: #aaa;
    }
</style>