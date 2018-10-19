<template>
  <div>
    <ul class="adm_list">
      <li><router-link class="router-link" to="/">Прокат</router-link></li>
      <li><router-link class="router-link" to="/customers">Клиенты</router-link></li>
      <li><router-link class="router-link" to="/history">История</router-link></li>
      <li><router-link class="router-link" to="/options">Настройки</router-link></li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'admPanel',
  }
</script>

<style>
  .adm_list {
    margin-bottom: 50px;
  }

  .router-link {
    padding: 5px 15px;
  }
  .router-link:hover {
    text-decoration: none;
    border-bottom: 2px solid #333;
  }
  .router-link-exact-active {
    border: 2px solid #333;
  }
</style>