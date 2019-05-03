<template>
    <div class="repairs">
        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">В ремонте</h2>
                <small> {{ currentRepairs.length }} шт</small>
                <button @click="newRepair()">Добавить в ремонт</button>            
            </div>
            <table class="repairs__table">
                <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th colspan="2"><small>Стоимости <br>компл. и работы</small></th>
                    <th>Примечание</th>
                    <th>Начало</th>
                </tr>
                <tr v-for="item in currentRepairs.filter(filt)" @click="changeRepair(item)" :key="item.id_rent">
                    <td class="repairs__td col--sign"><span class="sign sign--act"></span></td>
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.cost_comp }}</td>
                    <td class="repairs__td">{{ item.cost_work }}</td>
                    <td class="repairs__td col--note">{{ item.note | formNote }}</td>
                    <td class="repairs__td col--start">{{ item.start_time | shortDate }}</td>                
                </tr>
            </table>
        </div>

        <Details v-if="show === 'details'" :_repair="repair" @close="show = 'repairs'"></Details>
        <BikeList v-if="show === 'bikeList'" @close="show = 'repairs'" @select="addBikeToNewRepair($event)"></BikeList>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import * as Time from '@/functions/time';
    import Details from './Details';
    import BikeList from './BikeList';

    export default {
        components: {
            Details,
            BikeList
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
                const filter = copy(repairs.filter(i => !i.end_time));
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
    }
</script>
<style scoped>
    .repairs {
        width: 900px;
        display: flex;
        flex-direction: column;
        margin-bottom: 100px;
    }

    .table__wrap {
        display: flex;
        flex-direction: column;
        padding-top: 50px;
    }

    .caption-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .caption-wrap small {
        margin-left: 10px;
    }
    .caption-wrap button {
        margin-left: 50px;
    }
    .repairs__caption {
        font-size: 20px;
    }
    .repairs__caption:hover {
        cursor: pointer;

    }
    .repairs__table {
        /*outline: 1px solid #333;*/
        border-collapse: collapse;
        border: none;
        padding: 10px;
    }
    .repairs__td {
        border: 1px solid #333;
        padding: 5px;
    }
    .repairs tr:not(:first-child):hover {
        cursor: pointer;
        background-color: #333;
    }
    .col--sign {
        width: 15px;
        border: none;
    }
    .col--name {
        width: 150px;
    }
    .col--note {
        font-size: 14px;
    }
    .sign {
        display: block;
        width: 4px;
        height: 4px;
        border: 1px solid;
        border-radius: 50%;
    }
    .sign--end {
        border-color: red;
    }
    .sign--warn {
        border-color: orange;
    }
    .sign--act {
        border-color: green;
    }

    .showbtn {
        padding: 3px;
        text-align: center;
    }
</style>