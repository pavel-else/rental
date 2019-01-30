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
        beforeCreate() {
            const token = this.$route.params.token;

            this.$store.dispatch('AUTH_TOKEN', token)
            .then(() => {
                this.$router.push('/');
            })
            .catch((err) => {
                this.message = 'Не верный токен. '  + err;
            });
        }
    }
</script>