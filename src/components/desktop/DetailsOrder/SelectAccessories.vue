<!-- Vue component -->
<template>
    <div>
        <multiselect 
            v-model="value" 
            :options="options" 
            :multiple="true" 
            :close-on-select="true" 
            :clear-on-select="false" 
            :hide-selected="true" 
            :preserve-search="true" 
            placeholder="..." 
            label="name" 
            track-by="name" 
            :preselect-first="false"
        >
            <template slot="tag" slot-scope="props">
                <span class="custom__tag"><span>{{ props.option.name }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span>
            </template>

        </multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'

    export default {
        props: {
            data: Array, //accessories
            default: String
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
                this.$emit('setAccessories', this.value.map(a => a.id).join())
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
    .custom__remove {
        padding: 0 10px 0 5px;
        cursor: pointer;
    }
</style>