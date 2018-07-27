<template>
    <div>
        <ul class="adm_list">
            <li><router-link to="/">Прокат</router-link></li>
            <li><router-link to="/customers">Клиенты</router-link></li>
            <li><router-link to="/history">История</router-link></li>
            <li><router-link to="/options">Настройки</router-link></li>
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
    a:hover {
        text-decoration: none;

    }
</style>