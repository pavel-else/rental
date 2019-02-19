<template>
    <div class="option option-rental-point">
        <h3>{{ message }}</h3>
        <table class="table">
            <tr>
                <td>ID</td>
                <td><input :value="point.id_rent" disabled></td>
            </tr>
            <tr>
                <td>Логотип</td>
                <td><input @input="set('logo', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Название</td>
                <td><input v-model="point.name" @input="set('name', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Город</td>
                <td><input v-model="point.city" @input="set('city', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Адрес</td>
                <td><input v-model="point.address" @input="set('address', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Время работы</td>
                <td>
                    <input v-model="point.time_open" @input="set('time_open', $event.target.value)" placeholder="open:">
                    <input v-model="point.time_close" @input="set('time_close', $event.target.value)" placeholder="close:">
                </td>
            </tr>
            <tr>
                <td>Телефон</td>
                <td><input v-model="point.phone" @input="set('phone', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Краткое описание</td>
                <td><input v-model="point.description_short" @input="set('description_short', $event.target.value)"></td>
            </tr>
            <tr>
                <td>Описание</td>
                <td><textarea v-model="point.description" @input="set('discriptions', $event.target.value)"></textarea></td>
            </tr>
            <tr>
                <td>Точка на карте</td>
                <td><input @input="set('coordinates', $event.target.value)"></td>
            </tr>
        </table>

        <button class="option-general__button" @click="send">Применить</button>
    </div>
</template>

<script>
    import copy from '../../functions/copy'

    export default {
        data() {
            return {
                point: copy(this.$store.getters.rentalPointInfo),
                change: false,
                message: ''
            }
        },
        methods: {
            set(optionName, value) {
                this.point[optionName] = value;
            },
            send() {
                this.$store.dispatch('sendRentalPointOptions', this.point)
                .then(this.showMessage('Данные обновлены'));
            },
            logout() {
                this.$store.dispatch('AUTH_LOGOUT');
                this.$store.dispatch('REBOOT_APP_INIT_STATUS');
                this.$router.push('/Login');
            },
            showMessage(message) {
                this.message = message;
            }
        },
        computed: {
            rentalPointInfo() {
                return copy(this.$store.getters.rentalPointInfo);
            }
        }
    }
</script>
<style scoped>
    .option-general__button {
        margin-top: 20px;
    }
</style>