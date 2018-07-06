<template>
    <div class="options">
        <ul class="options__list">
            <li class="options__link" @click="select('general')">Общие</li>
            <li class="options__link" @click="select('tariffs')">Тарифы</li>
            <li class="options__link" @click="select('products')">Товары</li>
            <li class="options__link" @click="select('accessories')">Аксессуары</li>
            <li class="options__link" @click="select('deposit')">Залог</li>
            <li class="options__link" @click="select('sale')">Скидки</li>
        </ul>
        <General v-if="show.general"></General>
        <Tariffs v-if="show.tariffs"></Tariffs>
    </div>
</template>
<script>
    import Tariffs from './Tariffs'
    import General from './General'

    export default {
        components: {
            Tariffs,
            General
        },
        data() {
            return {
                show: {
                    general: false,
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
    .options__link {
        padding: 5px;
    }
</style>