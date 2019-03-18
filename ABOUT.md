# Rentix doc

## Общая информация

## Компонент
### Общая структура
<template></template>
<script>
    import ...
    export default {
        // Входящие параметры
        // Если компонент меняет входящие параметры, то их принимать общем объекте нагрузки и в дальнейщем работать с их копией.
        props: {
            payload: Object // Product - в коментах указание, что именно приходит,
            productName: String
        },
        data() {
            return {}
        },
        // Хуки
        created() {},
        methods() {},
        computed() {},
        watch() {}
    }
</script>
<style scoped></style>

## Стор
структура стора:

export default {

    // Стэйт
    // Содержит сущности, существительные
    state: {
        name: null,
        address: null,
        phone: null
    },

    // Геттеры
    // Из приложения к геттерам обращаются так: this.$store.getters.rentalPointInfo, т.е. через приставку getters
    // Поэтому они именуются как существительные (rentalPointInfo)
    getters: {
        rentalPointInfo(state) {
            return {
                name: state.name,
                address: state.address,
                phone: state.phone
            }
        }
    },

    // Мутэйшины
    // Должны быть синхронными
    // Изменяют стэйт, причем стэйт меняют только они
    // Из приложения их вызвать можно, но не нужно. Вызываются только из Экшинов
    // Из Экшинов вызываются через ключевое слово commit. Например: commit('rentalPointInfo')
    // Именовать без приставки set, просто именем существительным, указывая что именно нужно изменить
    mutations: {
        rentalPointInfo(state, rentalPointInfo) {
            for (let i in rentalPointInfo) {
                state[i] = rentalPointInfo[i];
            }
        }
    },

    // Экшины
    // Работают асинхронно, запросы к API делают они
    // Если нужно, вызывают мутации стэйта
    // Имена придумывать относительно приложения, можно использовать приставки get, set и.т.д
    actions: {
        
    }
}
