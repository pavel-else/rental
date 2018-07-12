<template> 
    <div id="app">
        <adm-panel class="adm"></adm-panel>
        <router-view></router-view>        
        <!-- <test></test> --> 
    </div>
</template>

<script>
    
import admPanel from './components/adm-panel'

import Test from './components/Test'

export default {
    name: 'app',

    components: {
        admPanel,
        Test
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
        margin: 0 auto;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

    }
    .container {
        display: flex;
        justify-content: center;
    }

    .tmp {
        outline: 1px solid lightgray;
    }

    .canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: flex-start;

        background-color: rgba(255, 255, 255, 0.7);
    }
    .details {
        position: relative;
        min-width: 300px;
        padding: 5px 10px;

        border: 1px solid lightgray;
        background-color: #fff;
        box-shadow: 0 2px 5px 0px;  
    }
    .details__close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
    }
    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 9px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
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


    .adm {
        position: relative;
    }
</style>
