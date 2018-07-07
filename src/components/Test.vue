<template>
    <div>       
        <div>Отправить на сервер: <input type="text" v-model="h"></div>
        <button @click="onClick">TEST</button>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                h: 'setCustomer',
            }
        },

        methods: {
            onClick() {
                const cmd = 'getTariffs'
                const value = {id_rent: 178}

                this.$store.dispatch('send', {cmd, value})


            },                              
        },
    }
</script>