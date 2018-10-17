<template>
    <div class="categories">
        <ul>
            <li 
                class="categories__li" 
                v-for="category in categories"
                :key="category.name"
            >
                <input type="checkbox" v-model="category.check" @change="onSet()">
                {{ category.name }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            data: String // ids: '1,2,3'
        },
        data() {
            return {
                categories: this.$store.getters.categories.map(category => {
                    const ids = this.data ? this.data.split(',') : []

                    // Поле check нужно для отображения чекбоксов
                    category.check = ids.find(id => id === category.id_rent) ? true : false

                    return category
                }),

                map: [[1, [4, [5, 6, 7]]], [2, [3]]]
            }
        },

        methods: {
            onSet() {
                const filter = this.categories.filter(category => category.check == true)
                const ids = filter.map(category => category.id_rent)

                this.$emit('setCategories', ids.join())
            }
        },
    }
</script>

<style scoped>
    .categories__li {
        display: block;
    }
</style>