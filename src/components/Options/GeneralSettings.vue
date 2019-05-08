<template>
    <div class="option option-general">
        <table>
            <tr>
                <td>Округление</td>
                <td><input v-model="settings.rent_round_bill"></td>
                <td>(руб)</td>
            </tr>
            <tr>
                <td title="Минимальная стоимость тарифа устанавливается от начала проката до указанного времени">
                    Порог минимальной стоимости
                </td>
                <td><input :value="rentMinTime" @input="set('rent_min_time', $event.target.value * 60 * 1000)"></td>
                <td>(мин)</td>
            </tr>
            <tr>
                <td>Время на оформление</td>
                <td><input :value="registrationTime" @input="set('registration_time', $event.target.value * 60 * 1000)"></td>
                <td>(мин)</td>
            </tr>
            <tr>
                <td>Интервал обновления монитора</td>
                <td><input :value="timeToUpdateMonitor" @input="set('timeToUpdateMonitor', $event.target.value * 1000)"></td>
                <td>(сек)</td>
            </tr>
        </table>

        <button class="option-general__button" @click="send">Применить</button>
    </div>
</template>

<script>
    import copy from '@/functions/copy';
    export default {
        data() {
            return {
                settings: copy(this.$store.getters.generalSettings),
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
                return this.$store.getters.generalSettings.registration_time / 60 / 1000;
            },
            timeToUpdateMonitor() {
                return this.$store.getters.generalSettings.timeToUpdateMonitor / 1000;
            }
        },
        watch: {
            timeToUpdateMonitor() {
                console.warn('timeToUpdateMonitor', this.timeToUpdateMonitor);
                const time = this.timeToUpdateMonitor;

                if (time > 0) {
                    this.$store.dispatch('startAutoUpdateOrders', time * 1000);
                } else {
                    this.$store.dispatch('stopAutoUpdateOrders');
                }
            }
        }
    }
</script>
<style scoped>
    .option-general__button {
        margin-top: 20px;
    }
</style>