<template>
  <default-layout>
    <div class="container">
      <div class="customers-page">
        <h1 class="page__title">Создать нового клиента</h1>

        <CustomerForm @input="input" :customer="customer" />

        <button @click="create">Создать</button>
      </div>
    </div>
  </default-layout>
</template>

<script>
import axios from 'axios';
import Customer from '@/entities/customer';
import DefaultLayout from '@/layouts/default';
import CustomerForm from '@/components/Customers/CustomerForm';

export default {
  name: 'CustomersCreate',
  components: {
    DefaultLayout,
    CustomerForm,
  },
  data() {
    return {
      customer: new Customer(),
    };
  },
  methods: {
    input(customer) {
      this.customer = customer;
    },
    async create() {
      const result = await axios.post('api/customers', {
        ...this.customer,
      });
      // const customer = new Customer(result.data);
      if (result) {
        alert('Пользователь создан');
        this.$router.push({ name: 'Customers' });
      }
    }
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