<template>
    <div class="rental-categories">
        <ul class="rental-categories__list">
            <li 
                class="rental-categories__item"
                v-for="category in categories"
                @click="click(category)"
            >
                {{ category.name }}
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        beforeCreate() {
            this.$store.dispatch('getCategories');
        },
        data() {
            return {
                categories: this.$store.getters.categories,
            }
        },
        methods: {
            click(category) {
                this.$store.commit('activeCategory', category);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .rental-categories {
        &__list {
            display: flex;
            flex-direction: column;
            min-width: 100px;
        }
        &__item {
            padding: 5px 10px;
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>