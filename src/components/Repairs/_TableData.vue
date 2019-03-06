<!-- <template>
    <div class="repairs__data">
        <table class="repairs__table" v-if="repairs && repairs.length > 0">
            <tr class="repairs__first-line">
                <th class="repairs__th col--start">Начало</th>
                <th class="repairs__th col--name">Название</th>
                <th class="repairs__th">Тип</th>
                <th class="repairs__th repairs__th--cost">Стоимость комплектующих</th>
                <th class="repairs__th repairs__th--cost">Стоимость всего ремонта</th>
                <th class="repairs__th">Примечание</th>
                <th class="repairs__th" v-if="type === 'hist'">Завершение</th>
            </tr>
            
            <tr class="repairs__tr" v-for="item in repairs" :key="item.id_rent" @click="changeRepair(item)">
                <td class="repairs__td col--start">{{ short(item.start_time) }}</td>
                <td class="repairs__td col--name">{{ getName(item) }}</td>
                <td class="repairs__td">{{ item.types_fix }}</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_comp) }}</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_repair) }}</td>
                <td class="repairs__td">{{ formNote(item.note) }}</td>
                <td class="repairs__td"><span v-if="item.end_time">{{ short(item.end_time) }}</span></td>
            </tr>
        </table>

        <span class="repairs__span--empty" v-if="repairs && repairs.length < 1">Здесь пусто ...</span>

        <BikeList
            v-if="showBikeList"
            :payload="type"
            @close="closeBikeList()"
            @select="openRepair($event)"
        ></BikeList>
        <Repair 
            v-if="showRepair"
            :payload="repair"
            @save="saveRepair($event)"
            @stop="stopRepair($event)"
            @close="closeRepair()"
        ></Repair>

        <div class="repairs__buttons">
            <button class="repairs__button" v-if="type === 'fact'" @click="openBikeList()">Добавить в ремонт</button>
            <button class="repairs__button" v-if="type === 'plan'" @click="openBikeList()">Запланировать ремонт</button>
        </div>            
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import shortDate from '@/functions/shortDate';
    import BikeList from './BikeList';
    import Repair from './Repair';

    export default {
        components: {
            BikeList,
            Repair,
        },
        props: {
            type: String //type: fact || plan || hist
        },
        data() {
            return {
                showBikeList: false,
                showRepair: false,
                repair: {},
                lastStartTime: null
            }
        },
        methods: {
            openBikeList() {
                this.showBikeList = true;
            },
            closeBikeList() {
                this.showBikeList = false;
            },

            openRepair(product) {
                this.repair = {
                    id: null,
                    id_rent: null,
                    id_rental_org: null,
                    product_id: product.id_rent,
                    start_time: new Date(),
                    mileage: product.mileage,
                    types_fix: null,
                    cost_comp: 0,
                    cost_repair: 0,
                    note: '',
                    end_time: null,
                    product_name: product.name,
                    isNew: true
                };
                this.repair.is_plan = this.type === 'plan' ? true : false,
                this.showRepair = true;               
            },

            saveRepair(repair) {
                this.$store.dispatch('SET_REPAIR', repair);
            },

            stopRepair(repair) {
                this.$store.dispatch('STOP_REPAIR', repair);
            },

            closeRepair() {
                this.showRepair = false;
            },

            changeRepair(item) {
                this.repair = item;
                this.repair.product_name = this.getName(item);
                this.showRepair = true;
            },

            //getName
            getName(item) {
                const product = this.$store.getters.products.find(i => i.id_rent === item.product_id);
                return product ? product.name : '';
            },
            short(item) {
                return shortDate(item);
            },
            formNote(note) {
                return note.length > 15 ? note.substr(0, 10) + '...' : note;
            },
            getCost(cost) {
                return cost > 0 ? cost + 'р': '';
            }
        },
        computed: {
            repairs() {
                switch (this.type) {
                    case 'fact':
                        return this.$store.getters.repairs.filter(i => i.is_plan === '0' && !i.end_time);
                    case 'plan':
                        return this.$store.getters.repairs.filter(i => i.is_plan === '1' && !i.end_time);
                    case 'hist':
                        return this.$store.getters.repairs.filter(i => i.end_time);
                    default:
                        return [];
                }
            }
        }
    }
</script>
<style scoped>
    .repairs {
        width: 800px;
        display: flex;
        flex-direction: row;
    }

    .repairs tr:not(:first-child):hover {
        cursor: pointer;
        outline: 1px solid #333;
        padding: 5px 0;
    }
    .repairs__th {
        padding: 0 5px;
        max-width: 150px;
    }

    .repairs__td {
        padding-top: 7px;
    }
    .repairs__th--cost,
    .repairs__td--cost {
        text-align: center;
    }

    .repairs__span--empty {
        text-align: center;
        margin-top: 60px;
    }

    .repairs__buttons {
        margin-top: 30px;
    }
    .repairs__button {
        margin: 0;
    }
    
    .col--name {
        width: 120px;
    }
    .col--start {
        width: 70px;
        padding-right: 10px;
    }
</style> -->