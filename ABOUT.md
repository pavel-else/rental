# Rentix doc

## Общая информация

## Компонент
### Общая структура
    <template></template>
    <script>
        import ...
        export default {
            name: 'History',

            // Входящие параметры
            // Если компонент меняет входящие параметры, то их принимать общем объекте нагрузки и в дальнейщем работать с их копией.
            props: {
                payload: Object // Product - в коментах указание, что именно приходит,
                productName: String
            },

            components: {
                Details
            },

            // Хуки
            created() {},

            // Рабочие данные
            data() {
                return {}
            },

            
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

## Основные сущности

### Ордеры и сабордеры

Основными сущностями программы являются ордеры (orders) и сабордеры (subOrders).
К одному ордеру может принадлежать несколько сабордеров.
Связь между ними такая: order.id_rent === subOrder.order_id.

Ордер содержит в себе общую информацию о заказе: начало заказа, аванс, время старта, id клиента и тд.
Сабордер содержит в себе только частную информацию: время стопа, суммарное время паузы, стоимость проката, скидки и тд.

У каждого ордера и сабордера есть поле статус, при этом
order.status = 'ACTIVE' || 'END' || 'DEL'
subOrder.status = 'ACTIVE' || 'END' || 'DEL' || 'PAUSE'


### Продукты
...

## Работа приложения

### Основное положение
...

### Рабочий стол (Descktop)

Перед началом работы компонента осуществляется загрузка данных.

    getActiveOrders
    getActiveSubOrders 
    getProducts
    getTariffs
    getCustomers 
    getAccessories
    getGeneralSettings

Нужно учитывать, что этот компонент работает только с активными ордерами и сабордерами,
т. е. с сервера запрашиваются все те ордера и сабордера, статус которых равен 'ACTIVE' или 'PAUSE'