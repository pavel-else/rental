<template>
    <div class="categories">
        <ul>
            <li 
                class="categories__li" 
                v-for="category in categories"
                :key="category.name"
            >
                <input 
                    type="radio"
                    :checked="productCategory === category.id_rent" 
                    @change="onSet(category.id_rent)"
                    name="category"
                >
                {{ category.name }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            productCategory: String 
        },
        data() {
            return {
            }
        },

        methods: {
            onSet(categoryId) {
                this.$emit('setCategories', categoryId);
            }
        },
        computed: {
            categories() {
                return this.$store.getters.categories;
            }
        }
    }
</script>

<style scoped>
    .categories__li {
        display: block;
    }
</style>