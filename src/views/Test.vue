<template>
  <div class="test">
    <h1>This is an test page</h1>
    <Pagination :list="[1,2,3]">
      <template v-slot:item>
        item
      </template>
    </Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination';
export default {
  components: {
    Pagination,
  },

};
</script>
