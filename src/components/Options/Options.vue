<template>
    <div class="options">
        <ul class="options__list">
            <li class="options__link" @click="select('general')" :class="{options__link_act: show.general}">Общие</li>
            <li class="options__link" @click="select('tariffs')" :class="{options__link_act: show.tariffs}">Тарифы</li>
            <li class="options__link" @click="select('products')" :class="{options__link_act: show.products}">Товары</li>
            <li class="options__link" @click="select('categories')" :class="{options__link_act: show.categories}">Категории</li>
            <li class="options__link" @click="select('accessories')" :class="{options__link_act: show.accessories}">Аксессуары</li>
            <li class="options__link" @click="select('deposit')" :class="{options__link_act: show.deposit}">Залог</li>
            <li class="options__link" @click="select('sale')" :class="{options__link_act: show.sale}">Скидки</li>
        </ul>

        <General v-if="show.general"></General>
        <Tariffs v-if="show.tariffs"></Tariffs>
        <Products v-if="show.products"></Products>
        <Categories v-if="show.categories"></Categories>
        <Accessories v-if="show.accessories"></Accessories>

    </div>
</template>
<script>
    import Tariffs from './Tariffs/Tariffs'
    import General from './General'
    import Products from './Products/Products'
    import Categories from './Categories/Categories'
    import Accessories from './Accessories/Accessories'

    export default {
        components: {
            Tariffs,
            General,
            Products,
            Categories,
            Accessories
        },
        data() {
            return {
                show: {
                    general: true,
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