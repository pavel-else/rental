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
            promotion: null
        },
        components: { Multiselect },
        data () {
            return {
                value: this.$store.getters.promotions.find(i => i.id == this.promotion),                    
                options: this.$store.getters.promotions
            }
        },
        watch: {
            promotion() {
                this.value = this.$store.getters.promotions.find(i => i.id == this.promotion)
            },
            value() {
                this.$emit('setPromotion', this.value)
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>