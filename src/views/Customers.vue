<template>
  <default-layout>
    <div class="container">
      <div class="customers-page">
        {{ customers }}
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/layouts/default';
import Customers from '@/components/Customers';

export default {
  name: 'Customers',
  components: {
    DefaultLayout,
    Customers,
  },
  computed: {
    customers() {
      return this.$store.getters.customers;
    },
  }
}
</script>

<style lang="scss">
.main-page {
  width: 100%;
  display: flex;
}
</style>