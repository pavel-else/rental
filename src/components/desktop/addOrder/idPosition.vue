<template>
    <div class="customer-id">
        <div class="btns tmp" v-if="show">
            <!-- 
                Перебираем массив (матица 4х4) 
                Если в ячейке находится существующий ордер, выделяем его.
                Выбираемая ячейка выделяется также
            -->
            <div 
                v-for="(item, index) in btns"
                class="btn"
                :class="{active: item.position !== null, select: select == index}"
                @click="onClick(item, index)"
            >
                {{item.position}}
            </div>
        </div>
        <div class="btn" v-else @click="show = true">{{ select }}</div>
    </div>
</template>

<script>
    export default {
        props: {
            free: Number
        },
        data() {
            return {
                show: false,
                select: this.free
            }
        },
        methods: {
            onClick(item, order_id_position) {
                const order_id = item.order_id

                this.select = order_id_position
                
                this.$emit('setPosition', {order_id, order_id_position})

                this.show = false

                //console.log(order_id_position)
            }
        },

        computed: {
            btns() {
                /*
                *   Функция подготавливает массив (матрица 4х4) объектов.
                *   Массив необходим для визуализации существующих ордеров.
                *   Если ордер существует, то в ячейке содержится его индекс и order_id.
                *   Если ордера не существует, то в ячейке пустое значение вместо индекса, и id нового ордера
                */

                const result = []
                const orders = this.$store.getters.orders
                const newId = this.$store.getters.options.new_order_id

                const iter = (num) => {
                    const order = orders.find(o => o.order_id_position == num)

                    result[num] = {
                        position: order ? num : null,
                        order_id: order ? order.order_id : newId
                    }

                    return num < 1 ? result : iter(num - 1)
                }

                return iter(15)
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