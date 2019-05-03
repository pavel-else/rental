<template>
    <div class="repairs">
        <input type="" name="" placeholder="Начните вводить название" @input="search()">

        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">Завершено </h2>
                <small> {{ compleatedRepairs.length }} шт</small>
            </div>
            <table class="repairs__table" v-if="show === 'repairs'">
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
                    <td class="repairs__td col--start">{{ item.start_time | shortDate }}</td>                
                    <td class="repairs__td col--start">{{ item.end_time | shortDate }}</td>                
                </tr>
            </table>
        </div>

        <Details v-if="show === 'details'" :_repair="repair" @close="show = 'repairs'"></Details>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import * as Time from '@/functions/time';
    import Details from './Details';

    export default {
        components: {
            Details,
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

                this.filt = repair => {
                    const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
                    const name = product ? product.name : '';

                    return name.toUpperCase().indexOf(searchText.toUpperCase()) >= 0;
                };
            },
            changeRepair(repair) {
                this.repair = repair;
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
            formNote(note) {
                return note && note.length > 20 ? note.substr(0, 19) + '...' : note;
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
                const filter = copy(repairs.filter(i => i.end_time));
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