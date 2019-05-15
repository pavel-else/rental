<template>
    <div class="repair-settings">
        <div class="tables">
            <div class="table__container">
                <h3 class="table__caption">Плановое ТО</h3>
                <table>
                    <tr class="pointer" v-for="item in planRepairTypes" :key="item.id_rent" @click="selectType(item)">
                        <td>{{ item.name }}</td>
                        <td> - </td>
                        <td style="text-align: right">
                             {{ item.period }} ч.
                        </td>
                    </tr>
                </table>
            </div>

            <div class="table__container">
                <h3 class="table__caption">Внеплановое ТО</h3>
                <table>
                    <tr class="pointer" v-for="item in notPlanRepairTypes" :key="item.id_rent" @click="selectType(item)">
                        <td>{{ item.name }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <DetailsType v-if="show === 'details'" :_repairType="repairType" @close="closeDetails()"/>

        <button class="button repair-settings__button" @click="createType()">Добавить</button>
    </div>
</template>

<script>
    import DetailsType from './repairsSettingsDetails';

    export default {
        components: {
            DetailsType
        },
        data() {
            return {
                show: 'list', // list || details
                repairType: null,
            }
        },
        methods: {
            createType() {
                this.repairType = {
                    isNew: true,
                    name: '',
                    is_plan: false,
                    period: 0
                };
                this.show = 'details';
            },
            selectType(type) {
                type.is_plan = type.is_plan === '1' ? true : false;

                this.repairType = type;
                this.show = 'details';
            },
            closeDetails() {
                this.show = 'list';
                this.repairType = null;
            }
        },
        computed: {
            repairTypes() {
                const types = this.$store.getters.repairTypes;
                return types.filter(i => i.status === 'active');
            },
            planRepairTypes() {
                return this.repairTypes.filter(i => i.is_plan === '1');
            },
            notPlanRepairTypes() {
                return this.repairTypes.filter(i => i.is_plan !== '1');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .repair-settings {
        .tables {
            display: flex;
            justify-content: space-between;
            min-width: 420px;
        }
        .table__container:first-child {
            margin-right: 50px;
        }
        &__button {
            
        }
    }
</style>
