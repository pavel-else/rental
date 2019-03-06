<template>
    <div class="canvas">
        <div class="details bikelist">
            <div class="bikelist__caption">
                <h3>
                    <span>Добавить в ремонт</span>
                </h3>
            </div>

            <table class="bikelist__table" v-if="products && products.length > 0">
                <tr>
                    <th>Название</th>
                    <th>Пробег</th>
                    <th>Дата последнего ремонта</th>
                </tr>
                <tr v-for="item in products" :key="item.id_rent" @click="select(item)">
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
        },
        data() {
            return {
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
                return this.$store.getters.products;
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