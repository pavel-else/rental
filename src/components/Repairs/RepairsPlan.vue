<template>
    <div class="repairs">
        <Details v-if="show === 'details'" :_repair="repair" @close="show = 'repairs'"></Details>

        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">Плановое ТО</h2>
                <small v-if="planRepairs"> {{ planRepairs.length }} шт</small>
            </div>

            <table class="repairs__table" v-if="planRepairs.length > 0">
                <tr class="repairs__first-line">
                    <th>Название</th>
                    <th>Тип</th>
                    <th title="Текущий пробег в часах">Текущий пробег</th>
                </tr>

                <tr class="repairs__tr" v-for="item in planRepairs.filter(filt)" @click="createRepair(item)" :key="item.product_id + '_' + item.repair_type">
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.mileage | round }} ч.<span v-if="item.last_repair_mileage"></span></td>
                </tr>
            </table>
            <div v-else>Здесь пока пусто ...</div>
        </div>

        <Tasks class="tasks"/>

    </div>
</template>

<script>
    import getPlanRepairs from './getPlanRepairs';
    import Details from './repairDetails';
    import Tasks from './repairTasks';

    export default {
        components: {
            Details,
            Tasks
        },
        data() {
            return {
                filt: i => i,
                show: 'repairs',
                repair: {},
            }
        },
        methods: {
            createRepair(repair) {
                this.repair = repair;

                this.repair.cost_work = 0;
                this.repair.status = 'active';
                this.repair.cost_comp = 0;
                this.repair.start_time = new Date();

                this.repair.isNew = true;
                this.repair.isPlan = true;
                this.repair.isCompleate = false

                this.show = 'details';
            },
        },
        computed: {
            planRepairs() {
                return getPlanRepairs(this.$store);
            },
        },
        filters: {
            // Округление проката
            round(mileage) {
                return mileage ? Math.round(mileage) : 0;
            }
        }

    };
</script>

<style lang="scss">
    @import './style.scss';
</style>

<style lang="scss" scoped>
    .repairs {
        position: relative;
    }
    .tasks {
        margin-top: 50px;
    }
</style>