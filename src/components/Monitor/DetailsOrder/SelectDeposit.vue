<!-- Vue component -->
<template>
    <div>
        <multiselect 
            label="name"
            v-model="value" 
            :options="options"
            :searchable="false" 
            :close-on-select="true" 
            :show-labels="false" 
            placeholder="..."
        >
        </multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'

    export default {
        props: {
            deposit: null
        },
        components: { Multiselect },
        data () {
            return {
                value: this.$store.getters.deposits.find(i => i.id_rent == this.deposit),
                options: this.$store.getters.deposits
            }
        },
        watch: {
            deposit() {
                this.value = this.$store.getters.deposits.find(i => i.id_rent == this.deposit) 
            },
            value() {
                this.$emit('setDeposit', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>