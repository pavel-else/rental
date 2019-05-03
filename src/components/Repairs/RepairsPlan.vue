<template>
    <div class="repairs">
        <div class="table__wrap">
            <div class="caption-wrap">
                <h2 class="repairs__caption">Плановое ТО</h2>
                <small v-if="planRepairs"> {{ planRepairs.length }} шт</small>
            </div>
            <table class="repairs__table" v-if="show === 'repairs'">
                <tr class="repairs__first-line">
                    <th></th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th title="Текущий пробег в часах">Текущий пробег</th>
                </tr>
                
                <tr class="repairs__tr" v-for="item in planRepairs.filter(filt)" @click="createRepair(item)" :key="item.product_id + '_' + item.repair_type">
                    <td class="repairs__td col--sign"><span class="sign sign--warn"></span></td>
                    <td class="repairs__td col--name">{{ item.product_name }}</td>
                    <td class="repairs__td">{{ item.repair_type_name }}</td>
                    <td class="repairs__td">{{ item.mileage | round }} ч.<span v-if="item.last_repair_mileage"></span></td>
                </tr>
            </table>            
        </div>

        <Details v-if="show === 'details'" :_repair="repair" @close="show = 'repairs'"></Details>
    </div>
</template>
<script>
    import copy from '@/functions/copy';
    import getPlanRepairs from './getPlanRepairs';
    import Details from './Details';

    export default {
        components: {
            Details,
        },
        data() {
            return {
                filt: i => i,
                show: 'repairs',
                repair: {},
            }
        },
        methods: {
            createRepair(repair) {
                this.repair = repair;

                this.repair.cost_work = 0;
                this.repair.cost_comp = 0;
                this.repair.start_time = new Date();

                this.repair.isNew = true;
                this.repair.isPlan = true;

                this.show = 'details';
            },

            // search() {
            //     const text = event.target.value;

            //     this.filt = repair => {
            //         const product = this.$store.getters.products.find(i => i.id_rent === repair.product_id);
            //         const name = product ? product.name : '';

            //         return name.toUpperCase().indexOf(text.toUpperCase()) >= 0;
            //     };
            // },
        },
        computed: {
            planRepairs() {
                return getPlanRepairs(this.$store);
            },
        },
        filters: {
            // Округление проката
            round(mileage) {
                return mileage ? Math.round(mileage) : 0;
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