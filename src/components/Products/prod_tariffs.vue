<template> 
    <div class="tariffs">
        <table>
            <tr v-for="tariff in tariffs" :key="tariff.id_rent">
                <td>
                    <input 
                        class="checkbox"
                        :id="'check__tariff-' + tariff.id_rent"
                        type="checkbox" 
                        v-model="tariff.check" 
                        @change="setTariffs"
                    >
                    <label :for="'check__tariff-' + tariff.id_rent" title="Привязать к товару">
                    </label>

                    <input 
                        class="radio" 
                        :id="'radio__tariff-' + tariff.id_rent"
                        type="radio" 
                        name="tariff_default"
                        :value="tariff.id_rent"
                        v-model="tariffDefault"
                        @change="setTariffDefault"
                    >
                    <label :for="'radio__tariff-' + tariff.id_rent" title="По умолчанию">
                    </label>
                </td>
                <td>{{ tariff.name }}</td>
            </tr>
        </table>        
    </div>
</template>

<script>
    export default {
        props: {
            data: Object // product
        },

        data() {
            return {
                tariffs: this.$store.getters.tariffs.map(tariff => {
                    const ids = this.data.tariff_ids ? this.data.tariff_ids.split(',') : []

                    // Поле check нужно для отображения чекбоксов
                    tariff.check = ids.find(id => id === tariff.id_rent) ? true : false

                    tariff.default = this.data.tariff_default == tariff.id_rent

                    return tariff
                }),

                tariffDefault: this.data.tariff_default,

            }
        },
        methods: {
            setTariffs() {
                const filter = this.tariffs.filter(tariff => tariff.check == true)
                const ids = filter.map(tariff => tariff.id_rent)

                console.log(this.check)

                this.$emit('setTariffs', ids.join())
            },
            setTariffDefault() {
                this.$emit('setTariffDefault', this.tariffDefault)
            },
        }
    }
</script>

<style scoped>
    li {
        display: block;
        border-bottom: 1px solid lightgray;
    }
</style>