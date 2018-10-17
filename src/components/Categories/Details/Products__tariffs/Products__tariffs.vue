<template> 
    <div class="tariffs">
        <table>
            <tr v-for="tariff in tariffs" :key="tariff.id_rent">
                <td>
                    <input type="checkbox" v-model="tariff.check" @change="onSet">
                </td>
                <td>{{ tariff.name }}</td>
            </tr>
        </table>        
    </div>
</template>

<script>
    export default {
        props: {
            data: String //tariff_ids
        },
        data() {
            return {
                tariffs: this.$store.getters.tariffs.map(tariff => {
                    const ids = this.data ? this.data.split(',') : []

                    // Поле check нужно для отображения чекбоксов
                    tariff.check = ids.find(id => id === tariff.id_rent) ? true : false

                    return tariff
                })
            }
        },
        methods: {
            onSet() {
                const filter = this.tariffs.filter(tariff => tariff.check == true)
                const ids = filter.map(tariff => tariff.id_rent)

                this.$emit('setTariffs', ids.join())
            }
        }
    }
</script>

<style scoped>
    li {
        display: block;
        border-bottom: 1px solid lightgray;
    }
</style>