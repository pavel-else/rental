<template>
    <div class="repairs">
        <!-- <Menu :selectedItem="type" style="margin-right: 20px" @selectItem="selectType($event)"></Menu> -->
        <TableData :type="type"></TableData>
    </div>
</template>
<script>
    import Menu from './Menu';
    import TableData from './TableData';

    export default {
        components: {
            Menu,
            TableData
        },
        beforeCreate() {
            this.$store.dispatch('GET_REPAIRS');
        },
        data() {
            return {
                type: 'fact', // fact || plan || hist
            }
        },
        methods: {
            selectType(item) {
                this.type = item;
            }
        }
    }
</script>
<style scoped>
    .repairs {
        width: 900px;
        display: flex;
        flex-direction: row;
    }
</style>