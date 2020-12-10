<template>
  <div class="wrap">
    <div class="app" v-if="mode === 'app'">
      <div class="app__wrap">
        <div class="loading" v-if="$store.getters.processing">
          <Loader />
        </div>

        <adm-panel class="adm-panel"/>

        <div class="app__content">
          <router-view/>
        </div>
      </div>
    </div>

    <Print v-if="mode === 'print'" />
  </div>
</template>

<script>
  import axios from 'axios';
  import admPanel from './components/AdmPanel';
  import Print from './components/Print/Print';
  import Loader from './components/Loader/Loader';

  export default {
    name: 'app',
    components: {
      admPanel,
      Print,
      Loader
    },
    async beforeCreate() {
      axios.defaults.baseURL = process.env.VUE_APP_BACKEND_API_URL;
      axios.defaults.headers.common['Authorization'] = process.env.VUE_APP_TOKEN;

      this.$store.dispatch('getProducts');
      this.$store.dispatch('getOrders');
      this.$store.dispatch('getSubOrders');

      if (!this.$store.getters.isAuthenticated) {
        this.$router.push('/#/login');
        return;
      }



      // await this.$store.dispatch('initStore');

      // Включение автообновления списка ордеров
      const time = this.$store.getters.generalSettings.timeToUpdateMonitor;
      if (time > 0) {
        this.$store.dispatch('startAutoUpdateOrders', time);
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
      max-width: 1024px;
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
      z-index: 100;
    }
  }
</style>
