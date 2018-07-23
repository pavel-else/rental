<template>
    <div class="categories">
        <ul>
            <li 
                class="categories__li" 
                v-for="(category) in categories"
                v-if="category.show"
                @click="onClick(category)"
            >
                <input type="checkbox" v-model="category.check">
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
                categories: this.$store.getters.categories.map(cat => {
                    //this.$set(cat, 'check',false)
                    cat.show = cat.parent == null ? true : false

                    return cat
                })
                    // Классическая реализация сортировки списка "пузырьком"                    
                    /*                    const sort = (acc) => {
                        if (!acc) {
                            return false
                        }

                        let tmp = null

                        for (let i = 0; i < acc.length; i++) {
                            for (let j = 1; j < acc.length; j++) {
                                if (acc[j].parent < acc[j - 1].parent) {
                                    tmp = acc[j]
                                    acc[j] = acc[j - 1]
                                    acc[j - 1] = tmp
                                }
                            }
                        }

                        return acc
                    }*/
            }
        },

        methods: {
            onClick(category) {
                console.log(this.categories)
            },

        }
    }
</script>

<style scoped>
    .categories__li {
        display: block;
    }
</style>