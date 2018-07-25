<template>
    <div class="categories">
        <ul>
            <li 
                class="categories__li" 
                v-for="(category) in categories"
                v-if="category.parent == null"
            >
                <input type="checkbox" v-model="category.check" @change="onClick(category)">
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
                categories: this.$store.getters.categories,

                map: [[1, [4, [5, 6, 7]]], [2, [3]]]
            }
        },

        methods: {
            onClick(category) {
                const map = this.map

                const ul = (fill) => {
                    return '<ul>' + fill + '</ul>'
                }

                const li = (fill) => {
                    return '<li>' + fill + '</li>'
                }

                const gen = (map) => {
                    return ul(map.map(item => {
                        return typeof(item) === 'object' ? li(gen(item)) :  li(item)
                    }))

                }

                console.log(gen(map))
            }
        },
        computed: {

        }
    }
</script>

<style scoped>
    .categories__li {
        display: block;
    }
</style>