<template>
    <v-pagination
        :value="value"
        :length="length"
        :total-visible="totalVisible"
        @input="$emit('input', $event)"
    />
</template>

<script>
export default {
    props: {
        value: [Number, String],
        length: [Number, String],
        'total-visible': {
            type: [Number, String],
            default: 7,
        },
    },
};
</script>

<style lang="scss">
.v-pagination {
    display: flex;
    align-items: center;

    li {
        margin: 0;
    }

    &__navigation,
    &__item {
        padding: 0;
        margin: 0 5px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-width: 1px;
    }
    &__item--active {
        border-width: 2px;
        background: #333333;
    }
}
</style>