<template>
    <div class="option option-general">
        <table>
            <tr>
                <td>Округление (руб)</td>
                <td><input v-model="settings.rent_round_bill"></td>
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
        </table>

        <button class="option-general__button" @click="send">Применить</button>
    </div>
</template>

<script>
    export default {
        beforeCreate() {
            this.$store.dispatch('getGeneralSettings')
            .then(() => {
                this.settings = this.$store.getters.generalSettings;
            });
        },
        data() {
            return {
                settings: this.$store.getters.generalSettings,
                change: false
            }
        },
        methods: {
            set(name, value) {
                this.settings[name] = value;
            },

            send() {                
                this.$store.dispatch('setGeneralSettings', this.settings);
            },

        },
        computed: {
            rentMinTime() {
                return this.$store.getters.generalSettings.rent_min_time / 60 / 1000;
            },
            registrationTime() {
                return this.$store.getters.generalSettings.registration_time / 60 / 1000
            },
        }
    }
</script>
<style scoped>
    .option-general__button {
        margin-top: 20px;
    }
</style>