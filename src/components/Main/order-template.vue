<template>
  <div class="order-template tmp">
    <div class="order-template__icon tmp">{{ order.id_rent }}</div>
    <div class="order-template__sub-orders tmp">
      <template v-for="subOrder in subOrders">
        <div class="order-template__sub-order sub-order" :key="subOrder.id_rent">
          <div class="sub-order__product">{{ getProductName(subOrder.product_id) }}</div>
          <div class="sub-order__duration">{{ getDuration(subOrder) | time }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    order: Object,
  },
  methods: {
    getProductName(productId) {
      const product = this.products.find((i) => i.id_rent === productId);

      return product ? product.name : '';
    },
    getDuration(subOrder) {
      const now = new dayjs();
      const diff = now.diff(this.startTime) - subOrder.pause_time;
      return dayjs.duration(diff);
    },
  },

  computed: {
    startTime() {
      return new dayjs(this.order.start_time);
    },
    subOrders() {
      return this.$store.getters.subOrders
        .filter((subOrder) => subOrder.order_id === this.order.id_rent);
    },
    products() {
      return this.$store.getters.products;
    },
  },
  filters: {
    time(duration) {
      const D = duration.days();
      const h = duration.hours();
      const m = duration.minutes();
      const s = duration.seconds();

      return `${D} ${h}:${m}:${s}`;
    }
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
