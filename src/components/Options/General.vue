<template>
    <div class="option option-general">
        <table>
            <tr>
                <td>Округление (руб)</td>
                <td><input v-model="rent_round_bill"></td>
            </tr>
            <tr>
                <td>Округление (мин)</td>
                <td><input></td>
            </tr>
            <tr>
                <td>Порог минимальной стоимости (мин)</td>
                <td><input v-model="rentMinTime"></td>
            </tr>
            <tr>
                <td>Время на оформление</td>
                <td><input></td>
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
        <button class="option-general__button" @click="onSet">Применить</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                rentMinTime: this.$store.getters.rentMinTime / 60 / 1000,
                rent_round_bill: this.$store.getters.rent_round_bill
            }
        },
        methods: {
            onSet() {
                this.$store.dispatch('rent_round_bill', this.rent_round_bill)
                this.$store.dispatch('rent_min_time', this.rentMinTime)
            }
        }
    }
</script>
<style scoped>
    .option-general__button {
        margin-top: 20px;
    }
</style>