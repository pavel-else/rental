<template>
    <div class="option option-rental-point">
        <h3>{{ message }}</h3>
        <table class="table table__rental-info">
            <tr>
                <td>ID</td>
                <td><input :value="point.id_rent" disabled></td>
            </tr>
            <tr>
                <td>Логотип</td>
                <td><input type="file" @input="set('logo', $event.target.value)"></td>
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
                    <div class="options__time-wrap">
                        <input type="time" class="options__input--time" style="margin-right: 5px" v-model="point.time_open" @input="set('time_open', $event.target.value)" placeholder="open:">
                        <input type="time" class="options__input--time" v-model="point.time_close" @input="set('time_close', $event.target.value)" placeholder="close:">
                    </div>
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
                <!-- <td><input @input="set('coordinates', $event.target.value)"></td> -->
                <td colspan="2"><iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A548e8cd2e20fb08de643851d0b02c3287a5f0ae16cca22e2219bdf303975b4ad&amp;source=constructor" width="500" height="400" frameborder="0"></iframe></td>
            </tr>
        </table>
        <div class="options__buttons-wrap">
            <button class="option-general__button" @click="save">Применить</button>
            <button @click="logout">Выйти из приложения</button>
        </div>
    </div>
</template>

<script>
    import copy from '../../functions/copy'

    export default {
        data() {
            return {
                change: false,
                message: ''
            }
        },
        beforeCreate() {
            this.$store.dispatch('getRentalPointInfo');
        },
        methods: {
            set(optionName, value) {
                this.point[optionName] = value;
            },
            save() {
                this.$store.dispatch('setRentalPointInfo', this.point)
                .then(this.showMessage('Данные обновлены'));
            },
            logout() {
                this.$store.dispatch('AUTH_LOGOUT');
                this.$store.dispatch('REBOOT_APP_INIT_STATUS');
                this.$router.push('/Login');
            },
            showMessage(message) {
                this.message = message;
            },
            logout() {
                this.$store.dispatch('AUTH_LOGOUT');
                this.$store.dispatch('REBOOT_APP_INIT_STATUS');
                this.$router.push('/Login');
            }
        },
        computed: {
            point() {
                return copy(this.$store.getters.rentalPointInfo);
            }
        }
    }
</script>
<style scoped>
    .table__rental-info {
        width: 400px;
    }
    .table__rental-info input,
    .table__rental-info textarea {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 10px;
    }
    .table__rental-info textarea {
        resize: vertical;
    }

    .options__time-wrap {
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
    }

    .options__buttons-wrap {
        margin: 20px 0;
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
        align-items: 
    }
    .option-general__button {
    }
</style>