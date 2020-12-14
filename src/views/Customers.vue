<template>
  <default-layout>
    <div class="container">
      <div class="customers-page">
        <template v-for="customer in customers">
          <customer-template
            class="customers-page__item"
            :key="customer.id_rent"
            :customer="customer"
          />
        </template>
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/layouts/default';
import CustomerTemplate from '@/components/customers/customer-template';

export default {
  name: 'Customers',
  components: {
    DefaultLayout,
    CustomerTemplate,
  },
  computed: {
    customers() {
      return this.$store.getters.customers;
    },
  }
}
</script>

<style lang="scss">
.customers-page {
  width: 100%;

  &__item {
    margin-bottom: 10px;
  }
}
</style>