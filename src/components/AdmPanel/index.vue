<template>
    <div class="menu">
        <ul class="menu__list">
            <li class="menu__item">
                <router-link class="menu__link" to="/">Прокат</router-link>
                <RentalCategories class="menu__sublist"></RentalCategories>
            </li>
            <li class="menu__item">
                <router-link class="menu__link" to="/customers">Клиенты</router-link>
            </li>
            <li class="menu__item">
                <router-link class="menu__link" to="/history">История</router-link>
            </li>
            <li class="menu__item">
                <router-link class="menu__link" to="/settings/">Настройки</router-link>
                <ul class="menu__sublist">
                    <li class="menu__item">
                        <router-link class="menu__link" to="/settings/main/">Точка проката</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/settings/general/">Общие</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/settings/tariffs/">Тарифы</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/settings/products/">Товары</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/settings/accessories/">Аксессуары</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/monitor/">Монитор</router-link>
                    </li>
                </ul>
            </li>
            <li class="menu__item">
                <router-link class="menu__link" to="/repairs">
                    <span 
                        class="sign sign__warn"
                        v-if="isThereAnyPlanRepairs"
                        :title="countPlanRepairs + 'шт'"
                    ></span>
                    Ремонт
                </router-link>
                <ul class="menu__sublist">
                    <li class="menu__item">
                        <router-link class="menu__link" to="/repairs/">
                            <span 
                                class="sign sign__warn"
                                v-if="isThereAnyPlanRepairs"
                                :title="countPlanRepairs + 'шт'"
                            ></span>
                            Плановое ТО
                            <span v-if="countPlanRepairs"> ({{ countPlanRepairs }})</span>
                        </router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/repairs/">В ремонте</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/repairs/">История</router-link>
                    </li>
                    <li class="menu__item">
                        <router-link class="menu__link" to="/repairs/settings/">Настройки</router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    import RentalCategories from './RentalCategories';
    import getPlanRepairs   from '@/components/Repairs/getPlanRepairs';

    export default {
        name: 'admPanel',
        components: {
            RentalCategories
        },
        computed: {
            planRepairs() {
                return getPlanRepairs(this.$store);
            },
            isThereAnyPlanRepairs() {
                return this.planRepairs.length > 0;
            },
            countPlanRepairs() {
                return this.planRepairs.length;
            }

        }
    }
</script>

<style lang="scss">
    .menu {
        &__item {
            margin: 0;
            padding: 0;
        }
        &__link {
            padding: 5px 20px;
            width: 100%;
            white-space: nowrap;
            text-decoration: none;
            &:hover {
                text-decoration: none;
                background-color: #333;
            }
        }
        &__item:hover &__sublist {
            position: absolute;
            display: none;
            flex-direction: column;
            margin: 6px 0;
            outline: 1px solid #333;
            background-color: #000;
            align-items: stretch;
            display: flex;
        }
        &__sublist {
            display: none;
            .menu__item {
                margin: 0px;
                width: 100%;
                display: flex;
            }
        }
        // Предопределенные названия классов
        .router-link:hover {
            text-decoration: none;
            border-bottom: 2px solid #333;
        }
        .router-link-exact-active {
            border: 2px solid #333;
        }
    }
    

    .sign {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin: 0 5px 1px 0;
        padding: 0;
        border: 1px solid white;
        border-radius: 50%;
        vertical-align: center;
        &__warn {
            border-color: orange;
        }
    }
</style>