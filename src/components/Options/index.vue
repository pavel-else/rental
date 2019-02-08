<template>
    <div class="options">
        <ul class="options__list">
            <li class="options__link" @click="select('rentalPointInfo')" :class="{options__link_act: show.rentalPointInfo}">Точка проката</li>
            <li class="options__link" @click="select('general')" :class="{options__link_act: show.general}">Общие</li>
            <li class="options__link" @click="select('tariffs')" :class="{options__link_act: show.tariffs}">Тарифы</li>
            <li class="options__link" @click="select('products')" :class="{options__link_act: show.products}">Товары</li>
            <li class="options__link" @click="select('categories')" :class="{options__link_act: show.categories}">Категории</li>
            <li class="options__link" @click="select('accessories')" :class="{options__link_act: show.accessories}">Аксессуары</li>
            <li class="options__link" @click="select('deposit')" :class="{options__link_act: show.deposit}">Залог</li>
            <li class="options__link" @click="select('sale')" :class="{options__link_act: show.sale}">Скидки</li>
        </ul>

        <RentalPointInfo v-if="show.rentalPointInfo"></RentalPointInfo>
        <General v-if="show.general"></General>
        <Tariffs v-if="show.tariffs"></Tariffs>
        <Products v-if="show.products"></Products>
        <Categories v-if="show.categories"></Categories>
        <Accessories v-if="show.accessories"></Accessories>
    </div>
</template>
<script>
    import RentalPointInfo     from './RentalPointInfo'
    import General     from './General'
    import Tariffs     from '../Tariffs'
    import Products    from '../Products'
    import Categories  from '../Categories'
    import Accessories from '../Accessories/'

    export default {
        components: {
            RentalPointInfo,
            Tariffs,
            General,
            Products,
            Categories,
            Accessories
        },
        data() {
            return {
                show: {
                    rentalPointInfo: true,
                    general: false,
                    tariffs: false,
                    products: false,
                    accessories: false,
                    deposit: false,
                    sale: false,
                }
            }
        },
        methods: {
            select(option) {
                this.show = {}
                this.show[option] = true
            },
            logout() {
                this.$store.dispatch('AUTH_LOGOUT');
                this.$router.push('/Login');
            }
        }
    }
</script>
<style>
    .options__list{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .options__link {
        padding: 5px;
    }
    .options__link:not(.options__link_act):hover {
        outline: 1px solid #333;
        cursor: pointer;
    }
    .options__link_act {
        outline: 2px solid #333;
    }
    .option {
        margin-top: 50px;
    }
</style>