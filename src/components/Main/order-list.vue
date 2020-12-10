<template>
  <div class="order-list">
    <template v-for="order in orders">
      <order-template 
        :key="order.id_rent"
        :order="order"
      />
    </template>

  </div>
</template>

<script>
  import OrderTemplate from './order-template';

  export default {
    components: {
      OrderTemplate
    },
    methods: {
    },

    computed: {
      orders() {
        return this.$store.getters.orders;
      },
    }
  };
</script>

<style lang="scss" scoped>
.order-list {

}
</style>
