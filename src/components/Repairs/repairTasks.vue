<template>
    <div class="reapir-tasks">
        <div class="caption-wrap">
            <h2 class="repairs__caption">Задачи на ремонт</h2>
        </div>

        <table class="tasks__table" v-if="tasks.length > 0">
            <tr class="repairs__tr" v-for="item in tasks" :key="item.id_rent">
                <td class="repairs__td col--name">{{ item }}</td>
           </tr>
        </table>
        <div v-else>Здесь пока пусто ...</div>

        <button @click="createTask()">Добавить</button>

        <Details v-if="show === 'details'" :_repair="task" @close="show = 'tasks'" />
        <BikesList v-if="show === 'bikeList'" @close="show = 'tasks'" @select="addBikeToNewRepair($event)" />
    </div>
</template>

<script>
    import getPlanRepairs from './getPlanRepairs';
    import Details from './repairDetails';
    import BikesList from './bikesList';

    export default {
        components: {
            Details,
            BikesList,
        },
        data() {
            return {
                show: 'tasks', // tasks || details || bikeList
                task: {},
            }
        },
        methods: {
            createTask() {
                const task = {
                    isNew: true,
                    isCompleate: false,
                    status: 'task',
                    cost_comp: 0,
                    cost_work: 0,
                };

                this.task = task;
                this.show = 'bikeList';
            },
            addBikeToNewRepair(product) {
                this.task.product_id = product.id_rent;
                this.task.product_name = product.name;
                this.show = 'details';
            },
        },
        computed: {
            tasks() {
                const repairs = this.$store.getters.repairs;

                return repairs.filter(i => i.status === 'task');
            },
        },
    };
</script>

<style lang="scss" >
    @import './style.scss';
</style>