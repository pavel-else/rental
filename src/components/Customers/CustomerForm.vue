<template>
  <div class="customer-form">
    <div class="customer-form__row">
      <label>Фамилия<input v-model="inCustomer.fname"></label>
      <label>Имя<input v-model="inCustomer.sname"></label>
      <label>Отчество<input v-model="inCustomer.tname"></label>
    </div>

    <div class="customer-form__row">
      <label>Телефон<input v-model="inCustomer.phone"></label>
      <label>Паспорт<input v-model="inCustomer.pasport"></label>
      <label>Адрес<input v-model="inCustomer.address"></label>
    </div>

    <div class="customer-form__row">
      <label>Дата рождения<input v-model="inCustomer.birth_date"></label>
      <label>Баланс<input v-model="inCustomer.balance"></label>
      <label>Скидка<input v-model="inCustomer.sale"></label>
    </div>

    <div class="customer-form__row">
      <label>Примечание<input v-model="inCustomer.note"></label>
    </div>
  </div>
</template>

<script>
import Customer from '@/entities/customer';

export default {
  props: {
    customer: Customer,
  },
  data() {
    return {
      inCustomer: this.customer,
    };
  },
  watch: {
    inCustomer: {
      handler(value) {
        this.$emit('input', value);
      },
      deep: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.customer-form {
  display: block;
}
</style>