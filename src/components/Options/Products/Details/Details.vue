<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="product.id_rent">Редактирование товара</span>
                <span v-else>Новый товар</span>
            </h3>
            <form @input="onChange">

                <table>
                    <tr>
                        <td>id</td>
                        <td><input :value="product.id_rent" disabled></td>
                    </tr>
                    <tr>
                        <td>Название</td>
                        <td><input v-model="product.name"></td>
                    </tr>
                    <tr>
                        <td>Стоимость</td>
                        <td><input v-model="product.cost"></td>
                    </tr>
                    <tr class="products_tr--tariffs">
                        <td>Тарифы</td>
                        <td>
                           <Tariffs :data="product.tariff_id" @setTariffs="setTariffs($event)"></Tariffs>                            
                        </td>
                    </tr>
                    <tr>
                        <td>Категории</td>
                        <td>
                            <Categories :data="product.categories" @setCategories="setCategories($event)"></Categories>                       
                        </td>
                    </tr>
                    <tr>
                        <td>Статус</td>
                        <td><input v-model="product.active"></td>
                    </tr>
                </table>
            </form>     
            
            <div class="btn-group">
                <button @click="save" :disabled="!change">Сохранить</button>
                <button @click="close">Отмена</button>
                <button @click="remove" v-if="product.id_rent">Удалить</button>      
            </div>

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    import Tariffs from './prod_tariffs'
    import Categories from './prod_categories'
    export default {
        props: {
            data: Object
        },
        components: {
            Tariffs,
            Categories
        },
        data() {
            return {
                // Не смог по-нормальному скопировать объект без геттеров, поэтому так
                product: JSON.parse(JSON.stringify(this.data)),
                change: false
            }
        },
        methods: {
            save() {
                this.product.updated = Math.floor(Date.now() / 1000)

                //console.log(this.product)

                console.log(this.product)
                this.$store.dispatch('send', {
                    cmd: 'setProduct',
                    value: this.product
                })

                this.$emit('close')
            },
            close() {                
                if (!this.change) {
                    this.$emit('close')
                    return
                }

                if (confirm('Изменения не сохранены. Вы уверены, что хотите выйти?')) {
                    this.$emit('close')
                }
            },
            remove() {
                if (confirm(`Вы действительно хотите удалить тариф '${this.product.name}'?`)) {
                    this.$store.dispatch('send', {
                        cmd: 'deleteProduct',
                        value: this.product.id_rent
                    })
                    this.$emit('close')
                }
            },

            onChange(e) {
                e.preventDefault()

                this.change = true

                //console.log(this.product)
            },
            setTariffs(ids) {
                this.product.tariff_id = ids
            },
            setCategories(ids) {
                console.log(ids)
                this.product.categories = ids
            }
        },
        computed: {
            tariffs() {
                return this.$store.getters.tariffs
            },
            categories() {
                return this.$store.getters.categories
            }
        }
    }
</script>

<style scoped>
    .details {
        width: 300px;
        margin-top: 120px;
    }
    input {
        width: 100%;
    }
    td {
        padding: 5px;
    }

    .btn-group {
    	margin-top: 10px;
    }
</style>