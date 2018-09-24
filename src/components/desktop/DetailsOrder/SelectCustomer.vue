<!-- Vue component -->
<template>
    <div>
        <multiselect 
            id="asdf"
            v-model="value" 
            deselect-label="" 
            track-by="fname" 
            label="fname" 
            placeholder="..."
            :custom-label="fullName"
            :options="options" 
            :searchable="true"
            :allow-empty="false"
            ref="vms"
        >
        </multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'

    export default {
        props: {
            customer: null,
            focus: Boolean
        },
        components: { Multiselect },

        mounted() {
            this.focus ? this.$refs.vms.$el.focus() : null
        },

        data () {
            return {
                value: this.$store.getters.customers.find(i => i.id_rent == this.customer),                
                options: this.$store.getters.customers
            }
        },
        methods: {
            fullName({fname, sname, tname}) {
                return `${fname} ${sname} ${tname}`
            }
        },
        watch: {
            customer() {
                this.value = this.customer 
                    ? this.$store.getters.customers.find(i => i.id_rent == this.customer)
                    : null
            },
            value() {
                this.$emit('setCustomer', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<style>
    .multiselect__input {
        background-color: #000 !important;
    }
</style>