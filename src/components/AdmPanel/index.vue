<template>
    <div>
        <ul class="list">
            <li><router-link class="router-link" to="/">Прокат</router-link></li>
            <li><router-link class="router-link" to="/customers">Клиенты</router-link></li>
            <li><router-link class="router-link" to="/history">История</router-link></li>
            <li class="list__item">
                <router-link class="router-link" to="/settings/">Настройки</router-link>
                <ul class="sublist">
                    <li><router-link class="sub-item" to="/settings/main/">Точка проката</router-link></li>
                    <li><router-link class="sub-item" to="/settings/general/">Общие</router-link></li>
                    <li><router-link class="sub-item" to="/settings/tariffs/">Тарифы</router-link></li>
                    <li><router-link class="sub-item" to="/settings/products/">Товары</router-link></li>
                    <li><router-link class="sub-item" to="/settings/accessories/">Аксессуары</router-link></li>
                </ul>
            </li>
            <li><router-link class="router-link" to="/repairs">Ремонт</router-link></li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'admPanel',
    }
</script>

<style>
    .list {
    }

    .router-link {
        padding: 5px 15px;
    }

    .sublist {
        display: none;
    }
    .list__item:hover .sublist {
        position: absolute;
        display: none;
        flex-direction: column;
        margin: 6px 0;
        outline: 1px solid #333;
        background-color: #000;
        align-items: stretch;
        display: flex;
    }
    .sublist li {
        margin: 0px;
        width: 100%;
        display: flex;
    }

    .sub-item {
        width: 100%;
        padding: 10px;
        text-decoration: none;
    }
    .sub-item:hover {
        background-color: #333;
        text-decoration: none;
    }
    .router-link:hover {
        text-decoration: none;
        border-bottom: 2px solid #333;
    }
    .router-link-exact-active {
        border: 2px solid #333;
    }
    .sublist .router-link-exact-active {
        border: none;
        background-color: #333;
    }
</style>