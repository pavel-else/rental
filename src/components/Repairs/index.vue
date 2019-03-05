<template>
    <div class="repairs">
        <input type="" name="" placeholder="Начните вводить название" @input="search()">

        <table class="repairs__table">
            <tr class="repairs__first-line">
                <th></th>
                <th>Название</th>
                <th>Тип</th>
                <th title="Текущий / Последнего ремонта">Пробег</th>
                <th>Стоимость<br>ремонта</th>
                <th>Примечание</th>
                <th>Начало</th>
                <th>Конец</th>
            </tr>
            
            <tr class="repairs__tr" v-for="item in repairs.plan.filter(filt)" @click="changeRepair(item)">
                <td class="repairs__td col--sign"><span class="sign sign--warn"></span></td>
                <td class="repairs__td col--name">{{ item.product_name }}</td>
                <td class="repairs__td">{{ item.repair_type_name }}</td>
                <td class="repairs__td">{{ item.mileage }}<span v-if="item.last_repair_mileage"> / {{ item.last_repair_mileage }}</span></td>
                <td class="repairs__td"></td>
                <td class="repairs__td col--note"></td>
                <td class="repairs__td col--start"></td> 
            </tr>

            <tr>
                <td><br></td>
            </tr>
            <tr v-for="item in currentRepairs.filter(filt)">
                <td class="repairs__td col--sign"><span class="sign sign--act"></span></td>
                <td class="repairs__td col--name">{{ item.product_name }}</td>
                <td class="repairs__td">{{ item.repair_type_name }}</td>
                <td class="repairs__td">{{ item.mileage }}<span v-if="item.last_repair_mileage"> / {{ item.last_repair_mileage }}</span></td>
                <td class="repairs__td">{{ item.cost_comp }} / {{ item.cost_repair }}</td>
                <td class="repairs__td col--note">{{ item.note }}</td>
                <td class="repairs__td col--start">{{item.start_time }}</td>                
            </tr>

            <tr>
                <td><br></td>
            </tr>
            <tr v-for="item in compleatedRepairs.filter(filt)">
                <td class="repairs__td col--sign"><span class="sign sign--end"></span></td>
                <td class="repairs__td col--name">{{ item.product_name }}</td>
                <td class="repairs__td">{{ item.repair_type_name }}</td>
                <td class="repairs__td">{{ item.mileage }}<span v-if="item.last_repair_mileage"> / {{ item.last_repair_mileage }}</span></td>
                <td class="repairs__td">{{ item.cost_comp }} / {{ item.cost_repair }}</td>
                <td class="repairs__td col--note">{{ item.note }}</td>
                <td class="repairs__td col--start">{{item.start_time }}</td>                
                <td class="repairs__td col--start">{{item.end_time }}</td>                
            </tr>
        </table>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import time from '@/functions/time';
    export default {
        beforeCreate() {
            this.$store.dispatch('getRepairs')
            .then(() => {
                this.repairs.plan = this.planRepairs;
                this.repairs.current = this.currentRepairs;
                this.repairs.compleate = this.compleatedRepairs;
            });
        },
        data() {
            return {
                repairs: {
                    compleate: [],
                    current: [],
                    plan: []
                },
                filt: i => i,
            }
        },
        methods: {
            filter(repairs) {
                return repairs.filter(this.filt);
            },
            changeRepair() {},
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
                return note.length > 20 ? note.substr(0, 19) + '...' : note;
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
                    return Date.parse(b.start_time) - Date.parse(a.start_time);
                }) : [];
            },
        },
        filters: {
            
        },
        computed: {
            planRepairs() {
                const products = copy(this.$store.getters.products);
                const repairs = copy(this.$store.getters.repairs);
                const repairTypes = copy(this.$store.getters.repairTypes);

                // Функция возвращает последний ремонт для определенного товара по определенному типу поломки
                // 
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
                            acc.push({
                                product_id: product.id_rent,
                                product_name: product.name,
                                repair_type: repairType.id_rent,
                                repair_type_name: repairType.name,
                                mileage: product.mileage,
                                last_repair: lastRepair ? lastRepair.end_time : '',
                                last_repair_mileage: lastRepair ? lastRepair.mileage : ''
                            });
                        }

                        return acc;
                    }, []);

                    return list;
                };

                // Перебираю все товары, для каждого генерирую список плановых ремонтов
                const planRepairs = products.reduce((acc, product) => {
                    const item = getPlanRepairs(product);

                    if (item && item.length > 0) {
                        acc = [...acc, ...item];
                    }

                    return acc;
                }, []);

                const formatToRepairs = (repairTypes) => {
                    return repairTypes ? repairTypes.map(i => {
                        return i;
                    }) : [];
                };

                return formatToRepairs(planRepairs);                
            },
            currentRepairs() {
                const repairs = this.$store.getters.repairs;
                const filter = copy(repairs.filter(i => !i.end_time));
                return filter.map(i => {
                    i.product_name = this.getProductName(i.product_id);
                    i.repair_type_name = this.getRepairTypeName(i.repair_type);
                    i.note = this.formNote(i.note);
                    i.start_time = time('d.m.y', i.start_time);
                    i.end_time = i.end_time ? time('d.m.y', i.end_time) : '';
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
                    i.note = this.formNote(i.note);
                    i.start_time = time('d.m.y', i.start_time);
                    i.end_time = i.end_time ? time('d.m.y', i.end_time) : '';
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
    .sign--end {
        border-color: red;
    }
    .sign--warn {
        border-color: orange;
    }
    .sign--act {
        border-color: green;
    }
</style>