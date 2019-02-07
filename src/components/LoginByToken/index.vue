<template>
    <div>
        {{ message }}
    </div>
</template>
<script>
    export default {
        data() {
            return {
                message: 'Инициализация...'
            }
        },
        /*
        * В приложение можно попасть по токену. При таком раскладе:
        * 1. Затираем старый токен
        * 2. Аутентифицируемся по новому токену
        * 3. Если все ОК, отправляем запрос инициализации
        * 4. Когда он придет, преходим в корень приложения
        */
        beforeCreate() {
            this.$store.dispatch('AUTH_LOGOUT');

            const token = this.$route.params.token;

            this.$store.dispatch('AUTH_TOKEN', token)
            .then(() => {
                this.$store.dispatch('INIT_APP').then(()=> this.$router.push('/'));
            })
            .catch((err) => {
                this.message = 'Не верный токен. '  + err;
            });
        }
    }
</script>