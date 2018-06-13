<template>
    <div class="customer-id">
        <div class="btn" v-if="show" @click="show=!show">{{ free }}</div>
        <div class="btns tmp" v-else>
            <div 
                class="btn"
                :class="{active: item.position}"
                @click="onClick(index)"
                v-for="(item, index) in btns"
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
            onClick(item) {
                this.select = item
            }
        },

        computed: {
            orders() {  
                return this.$store.getters.orders
            },
            btns() {
                const result = []
                const orders = this.$store.getters.orders

                for (let i = 0; i <= 15; i++) {
                    result[i] = {position: null}
                }

                for (let i = 0; i < orders.length; i++) {
                    let index = orders[i].order_id_position;

                    result[index].position = index
                }
                
                return result
            },
            free() {
                const result = []
                const orders = this.$store.getters.orders
                for (let i = 0; i < 15; i++) {
                    result[i] = null                    
                }

                for (let i = 0; i < orders.length; i++) {
                    result[i] = orders[i].order_id_position
                }

                
                let r = null
                for (let i = result.length; i >= 0; i--) {
                    if (r > result[i]) {
                        r = result[i]
                    }
                }

                return r
            }

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
        background-color: lightgray;
        margin: 2px;
    }
    .btn:hover {
        outline: 1px solid red;
        cursor: pointer;
    }
    .active {
        outline: 1px solid red;
    }
</style>