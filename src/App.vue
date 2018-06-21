<template> 
    <div id="app" class="tmp">
        <product-list class="tmp"></product-list>

        <new-order v-if="showNewOrder"></new-order>

        <order-list class="tmp"></order-list>
        
<!--         <test></test> -->
    </div>
</template>

<script>
import axios from 'axios'
import productList from './components/product-list'
import editOrder from './components/edit-order'
import orderList from './components/order-list'
import newOrder from './components/new-order'
import Test from './components/Test'

export default {
    name: 'app',

    components: {
        productList,
        editOrder, 
        orderList,
        newOrder,
        Test
    },

    computed: {
        showNewOrder() {
            return this.$store.getters.showNewOrder
        }
    },

    created() {
        //Запрос данных для инициализации и обновления компонентов приложения
        this.$store.dispatch('upd')

        // Обновление таймеров
        setInterval(() => {this.now = new Date()}, 1000)

        this.$store.dispatch('startTimer')
    },
}
</script>

<style>
    #app {
        display: flex;
        width: 960px;
        margin: 50px auto 0;
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }

    .tmp {
        outline: 1px solid lightgray;
    }

    .snippet {
        padding: 20px;
    }
    .snippet:first-child {
        margin-right: 50px;
    }
    .snippet h3 {
        text-align: center;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
