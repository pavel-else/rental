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
    </div>
</template>
<script>
    import Tariffs from './Tariffs/Tariffs'
    import General from './General'
    import Products from './Products/Products'
    import Categories from './Categories/Categories'

    export default {
        components: {
            Tariffs,
            General,
            Products,
            Categories
        },
        data() {
            return {
                show: {
                    general: true,
                    tariffs: false,
                    products: false,
                    accessories: false,
                    deposit: false,
                    sale: false
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
        cursor: pointer;
    }
    .options__link:hover {
        outline: 1px solid rgba(0,0 ,0, 0.2);
    }
    .options__link_act {
        text-decoration: underline;
    }
</style>