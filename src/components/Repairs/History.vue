<template>
    <div class="repairs">        

        <input placeholder="Начните вводить название" @input="search()">

        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">Завершено </h2>
                <small> {{ compleatedRepairs.length }} шт</small>
            </div>
            <table class="repairs__table" v-if="show === 'repairs'">
                <tr>
                    <th>Название</th>
                    <th>Тип</th>
                    <th colspan="2">Стоимость комплектующих <br>и работы</th>
                    <th>Примечание</th>
                    <th>Начало</th>
                    <th>Конец</th>
                </tr>
                <tr v-for="item in compleatedRepairs.filter(filt)" @click="changeRepair(item)" :key="item.id_rent">
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.cost_comp }}</td>
                    <td class="repairs__td">{{ item.cost_work }}</td>
                    <td class="repairs__td col--note">{{ item.note | formNote }}</td>
                    <td class="repairs__td col--start">{{ item.start_time | shortDate }}</td>
                    <td class="repairs__td col--start">{{ item.end_time | shortDate }}</td>
                </tr>
            </table>
        </div>

        <Dialog v-if="show === 'details'" @close="show = 'repairs'">
            <Details v-if="show === 'details'" :_repair="repair" @close="show = 'repairs'"></Details>
        </Dialog>

    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import * as Time from '@/functions/time';
    import Details from './repairDetails';
    import Dialog from '@/components/Dialog';

    export default {
        components: {
            Details,
            Dialog
        },
        data() {
            return {
                filt: i => i,
                repair: {},
                show: 'repairs', // repairs || details
            }
        },
        methods: {
            search() {
                // Метод просто обновляет фильтр, через который Vue пропускает список ремонтов в шаблоне
                const searchText = event.target.value;

                this.filt = (repair) => {
                    const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
                    const name = product ? product.name : '';

                    return name.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                };
            },
            changeRepair(repair) {
                this.repair = repair;
                this.repair.isNew = false;
                this.repair.isCompleate = true;
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
            sortByStart(repairs) {
                return repairs ? repairs.sort((a, b) => {
                    return Date.parse(b.end_time) - Date.parse(a.end_time);
                }) : [];
            },
        },
        computed: {
            compleatedRepairs() {
                const repairs = this.$store.getters.repairs;
                const filter = copy(repairs.filter(i => i.status === 'end'));
                const sort = this.sortByStart(filter);
                const map = sort.map(i => {
                    i.product_name = this.getProductName(i.product_id);
                    i.repair_type_name = this.getRepairTypeName(i.repair_type);
                    return i;
                });

                return map;
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
    }
</script>

<style lang="scss" >
    @import './style.scss';
</style>