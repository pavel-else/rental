<template>
    <div class="repairs">
        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">В ремонте</h2>
                <small> {{ currentRepairs.length }} шт</small>
                <button @click="newRepair()">Добавить в ремонт</button>
            </div>
            <table class="repairs__table" v-if="currentRepairs.length > 0">
                <tr>
                    <th>Название</th>
                    <th>Тип</th>
                    <th colspan="2"><small>Стоимости <br>компл. и работы</small></th>
                    <th>Примечание</th>
                    <th>Начало</th>
                </tr>
                <tr v-for="item in currentRepairs.filter(filt)" @click="changeRepair(item)" :key="item.id_rent">
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.cost_comp }}</td>
                    <td class="repairs__td">{{ item.cost_work }}</td>
                    <td class="repairs__td col--note">{{ item.note | formNote }}</td>
                    <td class="repairs__td col--start">{{ item.start_time | shortDate }}</td>
                </tr>
            </table>
            <div v-else>Здесь пока пусто ...</div>
        </div>

        <Dialog v-if="show === 'details'" @close="show = 'repairs'">
            <Details :_repair="repair"></Details>
        </Dialog>

        <Dialog v-if="show === 'bikeList'" @close="show = 'repairs'">
            <BikesList @select="addBikeToNewRepair($event)" />
        </Dialog>
    </div>
</template>

<script>
    import copy from '@/functions/copy';
    import * as Time from '@/functions/time';

    import Details   from './elements/details';
    import BikesList from './elements/bikesList';
    import Dialog    from '@/components/Dialog';

    export default {
        components: {
            Dialog,
            Details,
            BikesList
        },
        data() {
            return {
                filt: i => i,
                repair: {},
                show: 'repairs', // repairs || details || bikeList
            }
        },
        methods: {
            changeRepair(repair) {
                this.repair = repair;
                this.repair.isNew = false;
                this.show = 'details';
            },
            newRepair() {
                this.repair = {
                    cost_work: 0,
                    cost_comp: 0,
                    start_time: new Date(),
                    repair_type: null
                };

                this.repair.isNew = true;
                this.repair.isPlan = false;
                this.repair.isCompleate = false;
                this.show = 'bikeList';
            },
            addBikeToNewRepair(item) {
                this.repair.product_id = item.id_rent;
                this.repair.product_name = item.name;
                this.show = 'details';
            },

            // Методы вспомогательные для свойства currentRepairs
            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent === product_id);
                return product ? product.name : '';
            },
            getRepairTypeName(id_rent) {
                const repairType = this.$store.getters.repairTypes.find(i => i.id_rent === id_rent);
                return repairType ? repairType.name : '';
            },
        },
        computed: {
            currentRepairs() {
                const repairs = this.$store.getters.repairs;
                const filter = copy(repairs.filter(i => i.status === 'active'));

                return filter.map(i => {
                    i.product_name = this.getProductName(i.product_id);
                    i.repair_type_name = this.getRepairTypeName(i.repair_type);
                    i.mileage = this.$store.getters.products.find(product => product.id_rent === i.product_id).mileage;
                    return i;
                });
            },
        },
        filters: {
            // Округление проката
            round(mileage) {
                return mileage ? Math.round(mileage) : 0;
            },
            shortDate(date) {
                return Time.format('DD.MM.YY', date);
            },
            formNote(note) {
                return note && note.length > 20 ? note.substr(0, 19) + '...' : note;
            },
        }
    };
</script>
