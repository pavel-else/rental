<template>
    <div class="reapir-tasks">
        <div class="caption-wrap">
            <h2 class="repairs__caption">Задачи на ремонт</h2>
<!--            <small v-if="planRepairs"> {{ planRepairs.length }} шт</small>-->
        </div>

        <table class="tasks__table" v-if="tasks.length > 0">
<!--            <tr class="repairs__first-line">-->
<!--                <th>Название</th>-->
<!--                <th>Тип</th>-->
<!--                <th title="Текущий пробег в часах">Текущий пробег</th>-->
<!--            </tr>-->

            <tr class="repairs__tr" v-for="item in tasks">
                <td class="repairs__td col--name">{{ item.product_name }}</td>
                <td class="repairs__td">{{ item.repair_type_name }}</td>
                <td class="repairs__td">{{ item.mileage | round }} ч.<span v-if="item.last_repair_mileage"></span></td>
            </tr>
        </table>
        <div v-else>Здесь пока пусто ...</div>
    </div>
</template>

<script>
    import getPlanRepairs from './getPlanRepairs';
    import Details from './repairDetails';

    export default {
        // components: {
        //     Details,
        // },
        // data() {
        //     return {
        //         filt: i => i,
        //         show: 'repairs',
        //         repair: {},
        //     }
        // },
        // methods: {
        //     createRepair(repair) {
        //         this.repair = repair;
        //
        //         this.repair.cost_work = 0;
        //         this.repair.cost_comp = 0;
        //         this.repair.start_time = new Date();
        //
        //         this.repair.isNew = true;
        //         this.repair.isPlan = true;
        //         this.repair.isCompleate = false
        //
        //         this.show = 'details';
        //     },
        // },
        computed: {
            tasks() {
                const repairs = this.$store.getters.repairs;

                return repairs.filter(i => !i.start_time);
            },
        },
        // filters: {
        //     // Округление проката
        //     round(mileage) {
        //         return mileage ? Math.round(mileage) : 0;
        //     }
        // }

    };
</script>

<style lang="scss" >
    @import './style.scss';
</style>