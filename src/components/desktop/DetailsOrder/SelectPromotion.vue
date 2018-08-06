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
            data: Array,
            default: null
        },
        components: { Multiselect },
        data () {
            return {
                value: this.data.find(i => i.id == this.default),                    
                options: this.data
            }
        },
        watch: {
            value() {
                this.$emit('setPromotion', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>