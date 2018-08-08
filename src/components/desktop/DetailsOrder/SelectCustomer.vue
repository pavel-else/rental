<!-- Vue component -->
<template>
    <div>
        <multiselect 
            v-model="value" 
            deselect-label="" 
            track-by="fname" 
            label="fname" 
            placeholder="..."
            :custom-label="fullName"
            :options="options" 
            :searchable="true"
            :allow-empty="false"
        >
        </multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'

    export default {
        props: {
            data: Array, //customers
            default: null
        },
        components: { Multiselect },
        data () {
            return {
                value: this.$store.getters.customers.find(c => c.id_rent == this.default),                  
                options: this.data
            }
        },
        methods: {
            fullName({fname, sname, tname}) {
                return `${fname} ${sname} ${tname}`
            }
        },
        watch: {
            value() {
                this.$emit('setCustomer', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>