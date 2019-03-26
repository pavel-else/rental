<template>
    <div>
        <multiselect 
            v-model="value" 
            deselect-label="" 
            track-by="name" 
            label="name" 
            placeholder="Выбрать" 
            :options="options" 
            :searchable="false" 
            :allow-empty="false"
        >
            <template slot="singleLabel" slot-scope="{ option }">
                <strong>{{ option.name }}</strong>
            </template>
        </multiselect>
    </div>
</template> 

<script>
    import Multiselect from 'vue-multiselect'

    export default {
        props: {
            dataTariffs: {
                type: Array,
                required: true
            },
            dataTariffDefault: null
        },
        components: { Multiselect },
        created() {
            // console.log(this.dataTariffs, this.dataTariffDefault)
        },
        data () {
            return {
                value: this.dataTariffDefault ? this.dataTariffs.find(tariff => tariff.id_rent == this.dataTariffDefault) : null,
                options: this.dataTariffs ? this.dataTariffs : []
            }
        },
        watch: {
            value() {
                this.$emit('setTariff', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>