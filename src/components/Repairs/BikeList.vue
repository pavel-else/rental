<template>
    <div class="canvas">
        <div class="details bikelist">
            <div class="bikelist__caption">
                <h3>
                    <span>Выберете велосипед</span>
                    <span 
                        class="caption__clarification"
                        :class="{ 'caption__clarification--select': type === 'fact' }"
                        @click="toClarificate('fact')"
                    >
                        для фактического ремонта
                    </span>
                    <span 
                        class="caption__clarification"
                        :class="{ 'caption__clarification--select': type === 'plan' }"
                        @click="toClarificate('plan')"
                    >
                        для запланированного ремонта
                    </span>
                </h3>
            </div>

            <table class="bikelist__table" v-if="products && products.length > 0">
                <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Пробег</th>
                    <th>Дата последнего ремонта</th>
                </tr>
                <tr v-for="item in products" :key="item.id_rent" @click="select(item)">
                    <td>
                        <span :class="{ 'sign--fix': item.in_repair }" title="Находится в ремонте в данный момент"></span>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.mileage > 0 ? item.mileage + ' ч': ''}}</td>
                    <td>{{ short(item.last_repair_time) }}</td>
                </tr>
            </table>
            
            <div class="details__close" @click="close()"></div>
        </div>  
    </div>
</template>
<script>
    import shortDate from '@/functions/shortDate'
    export default {
        props: {
            payload: String // type: fact || paln
        },
        data() {
            return {
                type: this.payload
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            select(item) {                
                this.$emit('select', item);
                this.$emit('close');
            },
            toClarificate(type) {
                this.type = type;
            },
            short(date) {
                return date ? shortDate(date) : '';
            }
        },
        computed: {
            products() {
                const products = this.$store.getters.products.map(product => {
                    product.in_repair = this.$store.getters.repairs.find(i => i.product_id == product.id_rent && !i.end_time && !i.is_plan);

                    // Не эфективно! Сделать поле Последнего ремонта в таб. Продуктов
                    const last_repair = this.$store.getters.repairs
                        .filter(i => i.product_id == product.id_rent && !i.end_time)
                        .reduce((acc, item) => {
                            acc = new Date(acc.end_time) < new Date(item.end_time) ? item.end_time : acc;
                            return acc;
                    }, this.$store.getters.repairs.find(i => i.product_id == product.id_rent && i.end_time));

                    product.last_repair_time = last_repair ? last_repair.end_time : false;
                    return product;
                });

                switch (this.type) {
                    case 'fact' :
                        return products.filter(i => i.status === 'active');
                    case 'plan' :
                        return products;
                    default: 
                        return [];
                }
            }
        }
    }
</script>
<style scoped>
    .details {
        width: 570px;
        margin-top: 30px;
        overflow-y: hidden;
        margin-bottom: 100px;
    }
    .bikelist__caption {
        display: inline-flex;
    }
    .caption__clarification {
        font-size: 12px;
        padding: 5px 10px;
        margin-left: 10px;
        cursor: pointer;
    }
    .caption__clarification--select {
        outline: 1px solid lightgray;
    }

    .bikelist__table {
        margin-top: 30px;
    }
    .details td {
        padding: 5px 20px;
    }
    .details tr:first-child th {
        padding-bottom: 20px;
    }
    .details tr:not(:first-child):hover {
        cursor: pointer;
    }

    .sign--fix {
        display: block;
        width: 4px;
        height: 4px;
        border: 1px solid red;
        border-radius: 50%;
    }
</style>