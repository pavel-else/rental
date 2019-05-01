<template>
    <div class="repairs">
        <input type="" name="" placeholder="Начните вводить название" @input="search()">

        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption" @click="showPlan = !showPlan">Плановое ТО</h2>
                <small v-if="repairs.plan"> {{ repairs.plan.length }} шт</small>
            </div>
            <table class="repairs__table" v-if="showPlan">
                <tr class="repairs__first-line">
                    <th></th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th title="Текущий пробег в часах">Текущий пробег</th>
                </tr>
                
                <tr class="repairs__tr" v-for="item in repairs.plan.filter(filt)" @click="planToRepair(item)" :key="item.product_id + '_' + item.repair_type">
                    <td class="repairs__td col--sign"><span class="sign sign--warn"></span></td>
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.mileage }}<span v-if="item.last_repair_mileage"></span></td>
                </tr>
            </table>            
        </div>
        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption" @click="showCurrent = !showCurrent">В ремонте</h2>
                <small v-if="repairs.plan"> {{ repairs.current.length }} шт</small>
                <button @click="newRepair()">Добавить в ремонт</button>            
            </div>
            <table class="repairs__table" v-if="showCurrent">
                <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th colspan="2">Стоимость комплектующих <br>и работы</th>
                    <th>Примечание</th>
                    <th>Начало</th>
                </tr>
                <tr v-for="item in currentRepairs.filter(filt)" @click="changeRepair(item)" :key="item.id_rent">
                    <td class="repairs__td col--sign"><span class="sign sign--act"></span></td>
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.cost_comp }}</td>
                    <td class="repairs__td">{{ item.cost_work }}</td>
                    <td class="repairs__td col--note">{{ formNote(item.note) }}</td>
                    <td class="repairs__td col--start">{{ shortDate(item.start_time) }}</td>                
                </tr>
            </table>
        </div>
        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption" @click="showCompleate = !showCompleate">Завершено </h2>
                <small v-if="repairs.compleate"> {{ repairs.compleate.length }} шт</small>
            </div>
            <table class="repairs__table" v-if="showCompleate">
                <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th colspan="2">Стоимость комплектующих <br>и работы</th>
                    <th>Примечание</th>
                    <th>Начало</th>
                    <th>Конец</th>
                </tr>
                <tr v-for="item in compleatedRepairs.filter(filt)" @click="changeRepair(item)" :key="item.id_rent">
                    <td class="repairs__td col--sign"><span class="sign sign--end"></span></td>
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.cost_comp }}</td>
                    <td class="repairs__td">{{ item.cost_work }}</td>
                    <td class="repairs__td col--note">{{ formNote(item.note) }}</td>
                    <td class="repairs__td col--start">{{ shortDate(item.start_time) }}</td>                
                    <td class="repairs__td col--start">{{ shortDate(item.end_time) }}</td>                
                </tr>
            </table>
        </div>

        <Details v-if="showDetails" :payload="repair" @close="showDetails = false"></Details>
        <BikeList v-if="showBikeList" @close="showBikeList = false" @select="addBikeToNewRepair($event)"></BikeList>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import getPlanRepairs from './getPlanRepairs';
    import * as Time from '@/functions/time';
    import Details from './Details';
    import BikeList from './BikeList';
    export default {
        beforeCreate() {
            this.$store.dispatch('getRepairs')
            .then(() => {
                this.repairs.plan = this.planRepairs;
                this.repairs.current = this.currentRepairs;
                this.repairs.compleate = this.compleatedRepairs;
            });
        },
        updated() {
            this.repairs.plan = this.planRepairs;
            this.repairs.current = this.currentRepairs;
            this.repairs.compleate = this.compleatedRepairs;            
        },
        components: {
            Details,
            BikeList
        },
        data() {
            return {
                repairs: {
                    compleate: [],
                    current: [],
                    plan: []
                },
                filt: i => i,
                repair: {},
                showDetails: false,
                showPlan: true,
                showCurrent: true,
                showCompleate: true,
                showBikeList: false
            }
        },
        methods: {
            getProductName(product_id) {
                const product = this.$store.getters.products.find(i => i.id_rent === product_id);
                return product ? product.name : '';
            },
            getRepairTypeName(id_rent) {
                const repairType = this.$store.getters.repairTypes.find(i => i.id_rent === id_rent);
                return repairType ? repairType.name : '';
            },
            getCost(cost) {
                return cost && cost > 0 ? cost : ''; 
            },
            formNote(note) {
                return note && note.length > 20 ? note.substr(0, 19) + '...' : note;
            },

            search() {
                const text = event.target.value;

                this.filt = repair => {
                    const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
                    const name = product ? product.name : '';

                    return name.toUpperCase().indexOf(text.toUpperCase()) >= 0;
                };
            },
            sortByStart(repairs) {
                return repairs ? repairs.sort((a, b) => {
                    return Date.parse(b.end_time) - Date.parse(a.end_time);
                }) : [];
            },

            changeRepair(repair) {
                this.repair = repair;
                this.showDetails = true;
            },
            planToRepair(repair) {
                this.repair = repair;
                this.repair.cost_work = 0;
                this.repair.cost_comp = 0;
                this.repair.start_time = new Date();

                this.repair.isNew = true;
                this.repair.isPlan = true;
                this.showDetails = true;
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
                this.showBikeList = true;
            },
            addBikeToNewRepair(item) {
                this.repair.product_id = item.id_rent;
                this.repair.product_name = item.name;
                this.showDetails = true;
            },
            shortDate(date) {
                return Time.format('DD.MM.YY', date);
            }
        },
        computed: {
            planRepairs() {
                return getPlanRepairs(this.$store);
            },
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
            compleatedRepairs() {
                const repairs = this.$store.getters.repairs;
                const filter = copy(repairs.filter(i => i.end_time));
                const sort = this.sortByStart(filter);
                const map = sort.map(i => {
                    i.product_name = this.getProductName(i.product_id);
                    i.repair_type_name = this.getRepairTypeName(i.repair_type);
                    return i;
                });

                return map;  
            }
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