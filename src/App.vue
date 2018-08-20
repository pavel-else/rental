<template> 
    <div class="app black">
        <div class="app__wrap">
            <adm-panel class="adm"></adm-panel>
            <router-view></router-view>        
            <!-- <test></test>  -->
        </div>
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
        this.$store.dispatch('startTimer')
    },
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

    html, body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    body {
        font-family: 'Roboto Condensed', sans-serif;
    }

    .app {
        width: 100%;
        height: 100%;
    }

    .app.black {
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);        
    }
    .app.white {
        background-color: rgba(255, 255, 255, 0.8);
        color: rgba(0, 0, 0, 0.8);        
    }

    .app__wrap {
        display: flex;
        width: 960px;
        margin: 0 auto;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
    }
    .black .canvas {
        background-color: rgba(0, 0, 0, 0.8);        
    }    
    .white .canvas {
        background-color: rgba(255, 255, 255, 0.7);        
    }

    .details {
        position: relative;
        min-width: 300px;
        padding: 5px 10px;
    }
    .black .details {
        border: 1px solid #333;
        background-color: #000;
        box-shadow: 0 2px 5px 0px #000;       
    }
    .white .details {
        border: 1px solid lightgray;
        background-color: rgba(255, 255, 255, 0.8);
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

    button {
        font-family: Roboto Condensed;
        border: none;
        border-radius: 5px;
        padding: 5px 15px;
        margin-right: 10px;
    }

    button:hover {
        cursor: pointer;
        font-weight: bold;
    }

    .white button {
        background-color: rgba(255, 255, 255, 0.8);
        border: 3px solid lightgray;
        color: #333;
    }
    .black button {
        background-color: #000;
        border: 3px solid #333;
        color: rgba(255, 255, 255, 0.8);
    }


    .adm {
        position: relative;
    }
</style>
