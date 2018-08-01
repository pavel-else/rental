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
                :class="item.class"
                @click="onClick(item, index)"
            >
                {{item.position}}
            </div>
        </div>
        <div class="btn" :class="selectIcon" v-else @click="show = true">{{ select }}</div>
    </div>
</template>

<script>
    import getOrderId from '../../../../functions/getOrderId'

    export default {
        props: {
            free: Number
        },
        data() {
            return {
                show: false,
                select: this.free,
                selectIcon: 'd' + this.free,
                icons: {
                    0: './img/star-green.svg',
                    3: './img/star-green.svg',
                }
            }
        },
        methods: {
            ...getOrderId,

            onClick(item, order_id_position) {
                const order_id = item.order_id

                this.select = order_id_position
                this.selectIcon = item.class
                
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
                const newId = this.getOrderId()

                const iter = (num) => {
                    const order = orders.find(o => o.order_id_position == num)

                    result[num] = {
                        position: order ? num : null,
                        order_id: order ? order.order_id : newId,
                        class: 'd' + num
                            
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
        width: 120px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .btn {
        width: 25px;
        height: 25px;
      /*background-color: #eee;*/
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

    .d0 {
        background-image: url('./img/star-green.svg');
    }
    .d1 {
        background-image: url('./img/star-yellow.svg');
    }
    .d2 {
        background-image: url('./img/star-purpur.svg');
    }
    .d3 {
        background-image: url('./img/star-red.svg');
    }

    .d4 {
        background-image: url('./img/circle-green.svg');
    }
    .d5 {
        background-image: url('./img/circle-yellow.svg');
    }
    .d6 {
        background-image: url('./img/circle-purpur.svg');
    }
    .d7 {
        background-image: url('./img/circle-red.svg');
    }

    .d8 {
        background-image: url('./img/triangle-green.svg');
    }
    .d9 {
        background-image: url('./img/triangle-yellow.svg');
    }
    .d10 {
        background-image: url('./img/triangle-purpur.svg');
    }
    .d11 {
        background-image: url('./img/triangle-red.svg');
    }

    .d12 {
        background-image: url('./img/rect-green.svg');
    }
    .d13 {
        background-image: url('./img/circle-yellow.svg');
    }
    .d14 {
        background-image: url('./img/circle-purpur.svg');
    }
    .d15 {
        background-image: url('./img/circle-red.svg');
    }


</style>