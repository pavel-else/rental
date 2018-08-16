<template>
    <div>  
        <div v-if="answer">Ответ: {{ answer }}</div>    
        <div>Время проката, мин: <input type="text" v-model="h"></div>
        <button @click="onClick">TEST</button>
    </div>
</template>

<script>

    import getBill from "../functions/getBill"
    export default {

        data() {
            return {
                h: '30',
                tariffs: this.$store.getters.tariffs,
                tariff_id: 3,
                answer: null
            }
        },

        methods: {
            ...getBill,

            onClick() {
                this.answer = this.getBill(3, this.h * 60 * 1000)

                // const cmd = 'getTariffs'
                // const value = {id_rent: 178}

                // this.$store.dispatch('send', {cmd, value})


            },                              
        },
    }
</script>