<template>
    <div class="tasks">
        <div class="caption-wrap">
            <h2 class="repairs__caption">Задачи на ремонт</h2>
        </div>

        <table class="repairs__table" v-if="tasks.length > 0">
            <tr class="repairs__tr">
                <th>Товар</th>
                <th>Тип</th>
                <th>Примечание</th>
            </tr>
            <tr v-for="task in tasks" :key="task.id_rent" @click="changeRepair(task)">
                <td class="repairs__td col--name">{{ task.product_name }}</td>
                <td class="repairs__td">{{ task.repair_type_name }}</td>
                <td class="repairs__td col--note">{{ task.note | formNote}}</td>
            </tr>
        </table>
        <div v-else>Здесь пока пусто ...</div>

        <button class="btn-create" @click="createTask()">Добавить</button>

        <Dialog v-if="show === 'details'" @close="show = 'repairs'">
            <Details :_repair="task" @close="show = 'repairs'"></Details>
        </Dialog>

        <Dialog v-if="show === 'bikeList'" @close="show = 'repairs'">
            <BikesList @select="addBikeToNewRepair($event)" @close="show = 'repairs'"/>
        </Dialog>


    </div>
</template>

<script>
    import * as Time from '@/functions/time';

    import copy   from '@/functions/copy';
    import Dialog from '@/components/Dialog';

    import Details   from './details';
    import BikesList from './bikesList';

    export default {
        components: {
            Dialog,
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
                    status: 'task',
                    cost_comp: 0,
                    cost_work: 0,

                    status: 'task'
                };

                this.task = task;
                this.show = 'bikeList';
            },
            changeRepair(task) {
                this.task = task;
                this.task.isNew = false;

                this.show = 'details';
            },
            addBikeToNewRepair(product) {
                this.task.product_id = product.id_rent;
                this.task.product_name = product.name;
                this.show = 'details';
            },

            // Методы вспомогательные для свойства compleatedRepairs
            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent === product_id);
                return product ? product.name : '';
            },
            getRepairTypeName(id_rent) {
                const repairType = this.$store.getters.repairTypes.find(i => i.id_rent === id_rent);
                return repairType ? repairType.name : '';
            },
            sortByCreate(repairs) {
                return repairs ? repairs.sort((a, b) => {
                    return Date.parse(b.created) - Date.parse(a.created);
                }) : [];
            },
        },
        computed: {
            tasks() {
                const repairs = this.$store.getters.repairs;
                const tasks = copy(repairs.filter(i => i.status === 'task'));
                const tasksSorted = this.sortByCreate(tasks);
                const tasksExtended = tasksSorted.map(i => {
                    i.product_name = this.getProductName(i.product_id);
                    i.repair_type_name = this.getRepairTypeName(i.repair_type);

                    return i;
                });

                return tasksExtended;
            }
        },
        filters: {
            shortDate(date) {
                return Time.format('DD.MM.YY', date);
            },
            formNote(note) {
                return note && note.length > 20 ? note.substr(0, 19) + '...' : note;
            },
        }
    };
</script>

<style lang="scss" scoped>
    .btn-create {
        margin-top: 30px;
    }
</style>
