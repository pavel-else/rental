<template>
  <div class="order-template tmp">
    <div class="order-template__icon tmp">{{ order.id_rent }}</div>
    <div class="order-template__sub-orders tmp">
      <template v-for="subOrder in subOrders">
        <div class="order-template__sub-order sub-order" :key="subOrder.id_rent">
          <div class="sub-order__product">{{ getProductName(subOrder.product_id) }}</div>
          <div class="sub-order__duration">{{ getDuration(subOrder) | time }}</div>
          <div class="sub-order__bill">{{ getBill(subOrder) | money }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import getBill from '@/functions/getBill';

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
    getBill(subOrder) {
      return getBill(subOrder.tariff_id, this.getDuration(subOrder));
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

      return `${D} д ${h}:${m}:${s}`;
    },
    money(num) {
      return `${num} р.`;
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
  min-height: 25px;
  padding: 5px 10px;
  display: flex;
  align-items: center;

  &__product {
    width: 200px;
  }
  &__duration {
    width: 100px;
  }
}
</style>
