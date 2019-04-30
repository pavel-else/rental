<template> 
    <div class="app">
        <div class="app__wrap">
            <adm-panel class="adm"></adm-panel>
            <div class="app__content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>    
    import admPanel from './components/AdmPanel'

    export default {
        name: 'app',

        components: {
            admPanel,
        },
        created() {        
            // Обновление таймеров
            this.$store.dispatch('startTimer');
        }
    }

</script>

<style lang="scss">
    @import 'assets/scss/style';

    .app {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);        
    }

    .app__wrap {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 50px 0;
    }
    .app__content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 40px;
    }

    .adm {
        position: fixed;
        top: 0;
        background-color: #000;
        border-bottom: 1px solid #333;
    }
</style>