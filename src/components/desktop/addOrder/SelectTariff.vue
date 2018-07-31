<!-- Vue component -->
<template>
    <div>
        <multiselect 
            v-model="value" 
            deselect-label="Can't remove this value" 
            track-by="name" 
            label="name" 
            placeholder="Select one" 
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
            dataTariffs: Array,
            dataTariffDefault: String
        },
        components: { Multiselect },
        data () {
            return {
                //value: 'qwertty',
                //options: ['list', 'of', 'options']

                value: this.dataTariffs.find(tariff => tariff.id_rent == this.dataTariffDefault),                    
                options: this.dataTariffs
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

<style>

</style>