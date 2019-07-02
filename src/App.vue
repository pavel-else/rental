<template>
    <div class="wrap">
        <div class="app" v-if="mode === 'app'">
            <div class="app__wrap">
                <div class="loading" v-if="$store.getters.processing">
                    <Loader />
                </div>

                <adm-panel class="adm-panel"></adm-panel>

                <div class="app__content">
                   <router-view></router-view>
                </div>
            </div>
        </div>

        <Print v-if="mode === 'print'"></Print>        
    </div>
</template>

<script>    
    import admPanel from './components/AdmPanel'
    import Print from './components/Print/Print'
    import Loader from './components/Loader/Loader'

    export default {
        name: 'app',
        components: {
            admPanel,
            Print,
            Loader
        },
        beforeCreate() {
            if (this.$store.getters.isAuthenticated) {
                this.$store.dispatch('initStore')
                .then(() => {
                    // Включение автообновления списка ордеров
                    const time = this.$store.getters.generalSettings.timeToUpdateMonitor;
                    if (time > 0) {
                        this.$store.dispatch('startAutoUpdateOrders', time);
                    }
                })
            } else {
                this.$router.push('/#/login');
            }
        },
        created() {        
            // Обновление таймеров
            this.$store.dispatch('startTimer');
        },
        computed: {
            mode() {
                return this.$store.getters.orderToPrint ? 'print' : 'app'; // app || print
            }
        }
    };

</script>

<style lang="scss">
   @import 'assets/scss/style';
</style>

<style lang="scss" scoped>
    .app {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);  

        &__wrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px 50px 0;
        }
        &__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 40px;
        }

        .adm-panel {
            position: fixed;
            top: 0;
            background-color: #000;
            border-bottom: 1px solid #333;
        }

        .loading {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(255, 255, 255, .2);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100


        }
    }
</style>