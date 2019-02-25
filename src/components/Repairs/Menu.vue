<template>
    <nav class="repairs__menu">
        <ul class="list">
            <li class="item" :class="{ 'item--active': selectedItem === 'fact' }" @click="click('fact')">Фактически</li>
            <li class="item" :class="{ 'item--active': selectedItem === 'plan' }" @click="click('plan')">Запланировано</li>
            <li class="item" :class="{ 'item--active': selectedItem === 'hist' }" @click="click('hist')">История</li>
        </ul>
    </nav>
</template>
<script>
    import copy from '@/functions/copy';
    // import timeFormat from '@/functions/timeFormat';

    export default {
        props: {
            selectedItem: String
        },
        methods: {
            click(item) {
                this.$emit('selectItem', item);
            }
        }
    }
</script>
<style scoped>
    .repairs__menu .list {
        display: flex;
        flex-direction: column;
    }
    .repairs__menu .item {
        padding: 5px 20px;
    }

    .item:not(.item--active):hover {
        outline: 1px solid #333;
        cursor: pointer;
    }
    .item--active {
        outline: 2px solid #333;
    }
</style>