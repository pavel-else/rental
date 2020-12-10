<template>
  <default-layout>
    <div class="container">
      <div class="main-page">
        <!-- <product-list class="main-page__products" @addOrder="addOrder($event)" /> -->
        <order-list class="main-page__orders" />
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/layouts/default';
// import ProductList from '@/components/Main/product-list';
import OrderList from '@/components/Main/order-list';

export default {
  name: 'Main',
  components: {
    DefaultLayout,
    // ProductList,
    OrderList,
  }
}
</script>

<style lang="scss">
.main-page {
  width: 100%;
  display: flex;
  justify-content: space-between;

  &__products {
    flex-shrink: 2;
  }
}
</style>