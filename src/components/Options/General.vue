<template>
    <div class="option option-general">
        <table>
            <tr>
                <td>Округление (руб)</td>
                <td><input v-model="options.rent_round_bill"></td>
            </tr>
            <tr>
                <td title="Минимальная стоимость тарифа устанавливается от начала проката до указанного времени">
                    Порог минимальной стоимости (мин)
                </td>
                <td><input :value="rentMinTime" @input="set('rent_min_time', $event.target.value * 60 * 1000)"></td>
            </tr>
            <tr>
                <td>Время на оформление (мин)</td>
                <td><input :value="registrationTime" @input="set('registration_time', $event.target.value * 60 * 1000)"></td>
            </tr>
            <tr>
                <td>ID приложения</td>
                <td><input value="8800000001"></td>
            </tr>
            <tr>
                <td>Пароль</td>
                <td><input type="password" value="123123"></td>
            </tr>
        </table>

        <button class="option-general__button" @click="send">Применить</button>
    </div>
</template>

<script>
    import copyObject from '../../functions/copyObject'

    export default {
        data() {
            return {
                options: this.$store.getters.options,
                change: false
            }
        },
        methods: {
            ...copyObject,

            set(option, value) {
                this.options[option] = value
            },

            send() {
                console.log(this.options)
                
                this.$store.dispatch('send', {
                    cmd: 'setOptions',
                    value: this.options
                })
            }
        },
        computed: {
            rentMinTime() {
                return this.options.rent_min_time / 60 / 1000
            },
            registrationTime() {
                return this.options.registration_time / 60 / 1000
            },
        }
    }
</script>
<style scoped>
    .option-general__button {
        margin-top: 20px;
    }
</style>