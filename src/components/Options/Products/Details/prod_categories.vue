<template>
    <div class="categories">
        <ul>
            <li 
                class="categories__li" 
                v-for="category in categories"
            >
                <input type="checkbox" v-model="category.check">
                {{ category }}
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
                categories: (() => {
                    const categories = this.$store.getters.categories

                    const sort = () => {
                        const acc = []

                        return (cat) => acc.push(cat)
                    }

                    const f = sort()


                    categories.map(cat => f(cat))

                    console.log()
                })()
            }
        },
    }
</script>

<style scoped>
    .categories__li {
        display: block;
    }
</style>