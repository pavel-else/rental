<template>
    <div class="rental-categories">
        adsf
        <ul class="rental-categories__list">
            <li 
                class="rental-categories__item"
                v-for="category in categories"
                @click="click(category)"
            >
                {{ category.name }}
            </li>
            <!-- <li>afsd</li> -->
        </ul>
    </div>
</template>
<script>
    export default {
        created() {
            this.initCategories();
        },
        data() {
            return {
                categories: [],
            }
        },
        methods: {
            click(category) {
                this.$store.commit('activeCategory', category);
            },
            initCategories() {
                this.categories = this.$store.getters.categories;
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