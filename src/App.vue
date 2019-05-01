<template>
    <div class="wrap">
        <div class="app" v-if="mode === 'app'">
            <div class="app__wrap">
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

    export default {
        name: 'app',
        components: {
            admPanel,
            Print
        },
        beforeCreate() {
            this.$store.dispatch('multipleRequest', [
                { cmd: 'getActiveOrders' },
                { cmd: 'getActiveSubOrders' },
                { cmd: 'getProducts' },
                { cmd: 'getCustomers' },
                { cmd: 'getTariffs' },
                { cmd: 'getCategories' },
                { cmd: 'getAccessories' },
                { cmd: 'getGeneralSettings' },
                { cmd: 'getRentalPointInfo' },
                { cmd: 'getRepairs' },
                { cmd: 'getRepairTypes' },
            ]);
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
    }

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
    }
</style>