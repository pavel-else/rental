<template>
    <div class="history">
        <h2>История заказов</h2>
        <table class="history__table">
            <tr>
                <th>id</th>
                <th>ФИО</th>
                <th>Старт</th>
                <th>В прокате</th>
                <th>Продукт</th>
                <th>Стоимость</th>
                <th>Статус</th>
            </tr>
            <tr v-for="(item, index) in history" @click="showDetails(item)">
                <td class="">{{ item.order_id }}</td>
                <td class="">{{ item.customer_name }}</td>
                <td class="">{{ item.start_time }}</td>
                <td>{{ getTimePlay(item) }}</td>
                <td>
                    {{ item.products[0].name }}
                    <span v-if="item.products.length > 1"> и еще {{ item.products.length - 1 }} шт</span>
                </td>
                <td>{{ item.bill }}</td>
                <td>{{ item.status }}</td>
            </tr>
        </table>
    </div>
  
</template>

<script>
    export default {
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

            getTimePlay(item) {
                /*
                * Если время стопордера существует, вернем разницу времени стоп - старт,
                * если стопа еще не было, возвращаем разницу текущее время - старт
                */
                const now = this.$store.getters.now

                const products = item.products
                
                let max = null
                let end_time = null
                let diff = null 
                const start_time = Date.parse(item.start_time)

                for (let i = 0; i < products.length; i++) {
                    end_time = products[i].end_time ? Date.parse(products[i].end_time) : null
                    diff = end_time ? end_time - start_time : now - start_time

                    if (diff > max) max = diff                  
                }

                return this.timeFormat(diff)
            },

            showDetails(item) {
                console.log(item)
            }
        },
        computed: {
            history() {
                const history = this.$store.getters.history
                console.log(history)
                //if (typeof(history) !== 'array') return {}


                const result = history.filter(o => o.order_id > 780)

                return result
            }
        }
    }
</script>

<style>
    .history__table tr:not(:first-child):hover {
        cursor: pointer;
        box-shadow: 0px 0px 1px 0px;
    }

    .history__table td {
        border: 1px solid lightgray;
    }
</style>