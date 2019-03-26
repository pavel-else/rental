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
            fullName({ fname, sname, tname }) {
                const f = fname ? fname : '';
                const s = sname ? sname : '';
                const t = tname ? tname : '';

                return `${ f } ${ s } ${ t }`;
            },
        },
        watch: {
            customer() {
                this.value = this.customer 
                    ? this.$store.getters.customers.find(i => i.id_rent == this.customer)
                    : null
            },
            value() {
                this.$emit('setCustomer', this.value)
                if (!this.value) {
                    // console.log('empty value')
                }
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<style>
    .multiselect__input {
        background-color: #000 !important;
    }
    
    /* убрать надпись 'Press Enter to select'*/
    .multiselect__option--highlight::after {
        display: none;
    }
    /* убрать надпись 'selected'*/
    .multiselect__option--selected::after {
        display: none;
    }

    /*убрать надпись NOT FOUND*/
    .multiselect__content li:not(.multiselect__element) span {
        display: none;
    }
    .multiselect__content li:not(.multiselect__element)::before {
        content: 'нет совпадений';
    }
</style>