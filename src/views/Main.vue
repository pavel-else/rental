<template>
  <default-layout>
    <div class="container tmp">
      <product-list class="main-page__products" @addOrder="addOrder($event)" />
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/layouts/default';
import ProductList  from '@/components/Main/product-list';

export default {
  name: 'Main',
  components: {
    DefaultLayout,
    ProductList,
  }
}
</script>