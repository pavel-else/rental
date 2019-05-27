<template>
    <div class="repair-settings">

        <div class="r-types__wrap">

            <div class="r-types r-types--plan">
                <h3 class="r-types__caption">Плановое ТО</h3>
                <ul class="r-types__list">
                    <li class="r-types__item pointer" v-for="item in planRepairTypes" :key="item.id_rent" @click="selectType(item)">
                        <span>{{ item.name }}</span> <span> - {{ item.period }} ч.</span>
                    </li>
                </ul>
            </div>

            <div class="r-types r-types--unplan">
                <h3 class="r-types__caption">Внеплановое ТО</h3>
                <ul class="r-types__list">
                    <li class="r-types__item pointer" v-for="item in notPlanRepairTypes" :key="item.id_rent" @click="selectType(item)">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </div>


        <button class="button repair-settings__button" @click="createType()">Добавить</button>

        <Dialog v-if="show === 'details'" @close="show = 'list'">
            <Details :_repairType="repairType"></Details>
        </Dialog>
    </div>
</template>

<script>
    import Details from './elements/settingsDetails';
    import Dialog  from '@/components/Dialog';

    export default {
        components: {
            Details,
            Dialog
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
    };
</script>

<style lang="sass" scoped>

.repair-settings

    .r-types__wrap
        display: flex
        justify-content: space-between
        flex-wrap: wrap

    .r-types
        margin-bottom: 20px

    .r-types__caption
        margin-bottom: 10px

    .r-types__list
        margin: 0
        padding: 0
        display: flex
        flex-direction: column

    .r-types__item
        margin: 0
        padding: 2px 5px 2px 0
        display: flex
        justify-content: space-between

        &:hover
            background-color: #333

    .r-types--plan
        margin-right: 20px

    
</style>
