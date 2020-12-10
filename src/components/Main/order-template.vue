<template>
  <div class="order-template tmp">
    <div class="order-template__icon tmp">{{ order.id_rent }}</div>
    <div class="order-template__sub-orders tmp">
      <template v-for="subOrder in subOrders">
        <div class="order-template__sub-order sub-order" :key="subOrder.id_rent">
          <div class="sub-order__product">{{ getProductName(subOrder.product_id) }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      order: Object,
    },
    methods: {
      getProductName(productId) {
        const product = this.products.find((i) => i.id_rent === productId);

        return product ? product.name : '';
      },
    },

    computed: {
      subOrders() {
        return this.$store.getters.subOrders
          .filter((subOrder) => subOrder.order_id === this.order.id_rent);
      },
      products() {
        return this.$store.getters.products;
      },
    },
  };
</script>

<style lang="scss" scoped>
.order-template {
  width: 100%;
  display: flex;

  &__icon {
    width: 50px;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.sub-order {
  padding: 5px 10px;
}
</style>
