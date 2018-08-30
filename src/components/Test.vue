<template>
    <div>  
        <div v-if="answer">Ответ: {{ answer }}</div>    
        <div>Время проката, мин: <input type="text" v-model="h"></div>
        <button @click="onClick">TEST</button>
    </div>
</template>

<script>


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


            onClick() {


                // const cmd = 'getTariffs'
                // const value = {id_rent: 178}

                // this.$store.dispatch('send', {cmd, value})


            },                              
        },
    }
</script>