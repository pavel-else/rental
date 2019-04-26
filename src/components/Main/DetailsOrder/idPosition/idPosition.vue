<template>
    <div class="customer-id">
        <div class="btns" v-if="open">
            <div 
                class="btn"
                v-for="(item, index) in btns"
                :key="index"
                @click="onClick(item, index)"
            >
                <!-- {{ item.id_rent }} -->
                <Icon 
                    :id="index" 
                    :show="select == index || typeof(item.position) == 'number'" 
                    :select="select == index"
                >
                </Icon>
            </div>
        </div>
        <div class="btn" v-else @click="open = true">
            <Icon :id="select" :show="true" :select="false"></Icon>
        </div>
    </div>
</template>

<script>
    import getOrderId from '@/functions/getOrderId'
    import Icon from '../../../Icon/Icon'

    export default {
        props: {
            position: null
        },
        components: {
            Icon
        },
        data() {
            return {
                open: false,
                select: this.position,
                selectIcon: 'd' + this.position,
            }
        },
        methods: {
            ...getOrderId,

            onClick(item, order_id_position) {
                const id_rent = item.id_rent

                this.select = order_id_position
                this.selectIcon = item.class
                
                this.$emit('setPosition', { order_id: id_rent, order_id_position })

                this.open = false
            }
        },

        computed: {
            btns() {
                /*
                *   Функция подготавливает массив (матрица 4х4) объектов.
                *   Массив необходим для визуализации существующих ордеров.
                *   Если ордер существует, то в ячейке содержится его индекс и id_rent.
                *   Если ордера не существует, то в ячейке индекс, и id нового ордера
                */

                const result = []
                const orders = this.$store.getters.activeOrders;
                // const newId = this.getOrderId('new')
                const newId = null;

                const iter = (num) => {
                    const order = orders.find(i => i.order_id_position == num)

                    result[num] = {
                        position: order ? num : null,
                        id_rent: order ? order.id_rent : newId,
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
    .black .btns {
        border: 1px solid #333;
    }
    .white .btns {
        border: 1px solid lightgray;
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
        outline: 1px solid lightgray;
        cursor: pointer;
    }
    .active {
        outline: 1px solid red;
    }
    .select {
        outline: 1px solid red;
    }

    .icon {
        width: 100%;
        height: 100%;       
    }


</style>