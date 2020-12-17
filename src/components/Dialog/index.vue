<template>
  <div class="app-dialog">
    <div class="app-dialog__body tmp">dialog</div>
    <div class="app-dialog__overlay"></div>
  </div>
</template>

<script>
import Vue from 'vue';


export default Vue.component('AppDialog', {
  data() {
    return {
      simpleDialog: true,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  &__overlay {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, .5);
  }

  &__body {
    width: 300px;
    height: 200px;
  }
}
</style>