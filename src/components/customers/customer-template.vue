<template>
  <div class="customer-template">
    <div class="customer-template__fname">{{ customer.fname }}</div>
    <div class="customer-template__sname">{{ customer.sname }}</div>
    <div class="customer-template__tname">{{ customer.tname }}</div>
    <div class="customer-template__sale">
      <span v-if="customer.sale">{{ customer.sale }}%</span>
    </div>
    <div class="customer-template__note">
      <span v-if="customer.note">{{ customer.note }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customer: Object,
  }
};
</script>

<style lang="scss" scoped>
.customer-template {
  display: flex;

  &__fname {
    min-width: 150px;
  }
  &__sname {
    min-width: 120px;
  }
  &__tname {
    min-width: 140px;
  }
  &__sale {
    width: 50px;
  }

}
</style>