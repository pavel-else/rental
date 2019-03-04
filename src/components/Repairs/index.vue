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
            
            <tr class="repairs__tr" v-for="item in planRepairs" :key="item.id_rent" @click="changeRepair(item)">
                <!-- <td class="repairs__td col--sign"><span class="sign" :class="getSignClass(item)"></span></td> -->
                <td class="repairs__td col--name">{{ item.product_name }}</td>
<!--                 <td class="repairs__td">{{ getType(item) }}</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_comp) }}</td>
                <td class="repairs__td repairs__td--cost">{{ getCost(item.cost_repair) }}</td>
                <td class="repairs__td col--note" >{{ formNote(item.note) }}</td>
                <td class="repairs__td col--start">{{ (item.start_time) }}</td>
                <td class="repairs__td"><span v-if="item.end_time">{{ item.end_time }}</span></td> -->
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
                this.compleateRepairs = copy(this.$store.getters.repairs).filter(this.filter);
                this.planRepairs = this.makePlanRepairs().filter(this.filter);
            });
        },
        data() {
            return {
                compleateRepairs: [],
                planRepairs: [],
                filter: i => i,
            }
        },
        methods: {
            makePlanRepairs() {
                const products = copy(this.$store.getters.products);
                const repairs = copy(this.$store.getters.repairs);
                const repairTypes = copy(this.$store.getters.repairTypes);

                // Функция возвращает последний ремонт
                const getLastRepair = (product_id, repairType) => {
                    const filter = repairs.filter(i => i.product_id == product_id && i.repair_type == repairType && i.end_time);

                    const lastRepair = filter.reduce((acc, repair) => {
                        if (acc === null) {
                            acc = repair;
                        }

                        // Выбираем ремонт с наибольшим эндтайиом
                        if (Date.parse(repair.end_time) > Date.parse(acc.end_time)) {
                            acc = repair;
                        }

                        return acc;
                    }, null);

                    return lastRepair;
                };


                // Перебор всех возможных типов
                // Нахожу последний ремонт по этому типу
                // Проверяю пробег - не пора ли делать плановый ремонт?
                // если да, добавляю в список
                const getPlanRepairs = (product) => {
                    const list = repairTypes.reduce((acc, repairType) => {

                        // Находим последний ремонт по заданному типу
                        const lastRepair = getLastRepair(product.id_rent, repairType.id_rent);

                        const diff = product.mileage - (lastRepair ? lastRepair.mileage : 0);

                        if (diff >= repairType.period) {
                            acc.push(repairType, product);
                        }

                        return acc;
                    }, []);

                    return list.map(i => remakeToRepair(i));
                };

                const remakeToRepair = (type, product) => {
                    return {
                        product_name: product.name,
                        repair_type: type.id_rent,
                        cost_comp: 0,
                        cost_comp: 0,
                        note: '',
                        start_time: null,
                        end_time: null
                    };
                };

                // Перебираю все товары, клею списки плановых ремонтов в один большой список
                const planRepairs = products.reduce((acc, product) => {
                    const item = getPlanRepairs(product);

                    if (item && item.length > 0) {
                        acc = [...acc, ...item];
                    }

                    return acc;
                }, []);                

                return planRepairs;
            },
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
                return type ? type.name : '';
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
            getSignClass(item) {
                const className = item && item.sign ? 'sign--' + item.sign : false;
                return {className: true}
            }
        },
        computed: {
            repairs() {
                return [...this.planRepairs, ...this.compleateRepairs];
            }
        }
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
    .sign--act {
        border-color: green;
    }
</style>