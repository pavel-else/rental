<template>
    <div class="select-repair-type">
        <select v-if="mod === 'select'" :type="type" @change="setType()">
            <option disabled value="null">Выбрать</option>
            <option v-for="item in repairTypes" :value="item.id_rent" :key="item.id_rent">{{ item.name }}</option>
        </select>
        <div v-else class="">
            <input type="text" ref="input">
        </div>
    </div>
</template>
<script>
    import copy from '@/functions/copy';

    export default {
        props: {
            // type: String, 
        },
        data() {
            return {
                type: null,
                mod: 'select', // || input
            }
        },
        methods: {
            save() {
                const type = event.target.value;
                this.$emit('save', type);
            },
            setType() {
                const value = event.target.value;
                if (value === 'new') {
                    this.mod = 'input';
                    this.$nextTick(() => this.$refs.input.focus());
                    
                } else {
                    this.type = value;
                }
            }

        },
        computed: {
            repairTypes() {
                const types = copy(this.$store.getters.repairTypes);
                const planTypes = types ? types.filter(i => i.is_plan === '1') : [];
                const simpleTypes = types ? types.filter(i => i.is_plan === '0') : [];
                return [...planTypes, ...simpleTypes];
            }
        }
    }
</script>
<style scoped>
</style>