<template>
    <div class="repairs">
        <input type="" name="" placeholder="Начните вводить название" @input="search()">

        <table class="repairs__table" v-if="repairs && repairs.length > 0">
            <tr class="repairs__first-line">
                <th class="repairs__th col--sign"></th>
                <th class="repairs__th col--name">Название</th>
                <th class="repairs__th">Тип</th>
                <th class="repairs__th repairs__th--cost" colspan="2">Стоимость<br>ремонта</th>
                <th class="repairs__th">Примечание</th>
                <th class="repairs__th col--start">Начало</th>
                <th class="repairs__th">Завершение</th>
            </tr>
            
            <tr class="repairs__tr" v-for="item in getRepairs()" :key="item.id_rent" @click="changeRepair(item)">
                <td class="repairs__td col--sign"><span class="sign sign--warn">{{ is_plan(item) }}</span></td>
                <td class="repairs__td col--name">{{ getName(item) }}</td>
                <td class="repairs__td">{{ getType(item) }} Замена колеса</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_comp) }}</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_repair) }}</td>
                <td class="repairs__td col--note" >{{ formNote(item.note) }}</td>
                <td class="repairs__td col--start">{{ (item.start_time) }}</td>
                <td class="repairs__td"><span v-if="item.end_time">{{ item.end_time }}</span></td>
            </tr>
        </table>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    export default {
        beforeCreate() {
            this.$store.dispatch('getRepairs')
            .then(() => {
                this.repairs = this.sortByStart(copy(this.$store.getters.repairs));
            });
        },
        data() {
            return {
                repairs: [],
                filter: i => i,
            }
        },
        methods: {
            changeRepair() {},
            getRepairs() {
                return this.repairs.filter(this.filter);
            },
            getName(item) {
                const product = this.$store.getters.products.find(i => i.id_rent === item.product_id);
                return product ? product.name : '';
            },
            getCost(cost) {
                return cost && cost > 0 ? cost : ''; 
            },
            formNote(note) {
                return note.length > 20 ? note.substr(0, 19) + '...' : note;
            },
            getType(item) {
                const type = this.$store.getters.repairTypes.find(i => i.id_rent === item.repair_type);
                return type.name;
            },
            search() {
                const text = event.target.value;

                this.filter = repair => {
                    const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
                    const name = product ? product.name : '';

                    return name.toUpperCase().indexOf(text.toUpperCase()) >= 0 || repair.cost_comp.toUpperCase().indexOf(text.toUpperCase()) >= 0 || repair.cost_repair.toUpperCase().indexOf(text.toUpperCase()) >= 0;
                }
            },
            sortByStart(repairs) {
                return repairs ? repairs.sort((a, b) => {
                    return Date.parse(b.start_time) - Date.parse(a.start_time);
                }) : [];
            },
            is_plan(repair) {
                const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
                console.log(product)
            }
        },
    }
</script>
<style scoped>
    .repairs {
        width: 900px;
        display: flex;
        flex-direction: column;
    }
    .col--sign {
        width: 15px;
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
    .sign--fix {
        border-color: red;
    }
    .sign--warn {
        border-color: orange;
    }
</style>