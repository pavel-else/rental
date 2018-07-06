<template>
    <div class="option option-tariffs">
        <table>
            <tr v-for="tariff in tariffs">
                <td>{{ tariff }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        computed: {
            tariffs() {
                return this.$store.getters.tariffsList
            }
        }
        
    }
</script>