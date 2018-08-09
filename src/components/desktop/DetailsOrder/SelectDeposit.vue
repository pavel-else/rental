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
            data: Array, //deposits
            default: null
        },
        components: { Multiselect },
        data () {
            return {
                //deprecated
                // Должен приходить id/
                // Переделать, как будет готова таблица в БД
                value: this.data.find(d => d.name == this.default), 
                                 
                options: this.data
            }
        },
        watch: {
            value() {
                this.$emit('setDeposit', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>