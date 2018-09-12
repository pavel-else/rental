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
                        <td>Тарифы,<br>по умолчанию</td>
                        <td>
                            <Tariffs 
                                :data="product" 
                                @setTariffs="setTariffs($event)"
                                @setTariffDefault="setTariffDefault($event)"
                            >
                            </Tariffs>                            
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
                        <td>
                            <select v-model="product.status">
                                <option disabled value=""></option>
                                <option value="free">free</option>
                                <option value="fix">fix</option>
                                <option value="busy">busy</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </form>
            
            <div class="btn-group">
                <button @click="save" :disabled="!change">Сохранить</button>
                <button @click="close">Отмена</button>
                <button @click="remove" v-if="product.id_rent">Удалить</button>      
            </div>

            <p class="products__updated" v-if="product.id_rent">Дата последнего изменения: {{ product.updated }}</p> 

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    import copyObject from '../../../../functions/copyObject'

    import Tariffs    from './prod_tariffs'
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
                product: this.copyObject(this.data),
                change: false
            }
        },
        methods: {
            ...copyObject,

            save() {
                this.product.updated = Math.floor(Date.now() / 1000)

                //console.log(this.product)

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
                const title = "Почему Вы хотите удалить этот товар?"
                const def = "Причина удаления"
                const answer = prompt(title, def)

                if (answer) {
                    this.product.note = answer
                    this.product.status = 'deleted'
                    this.product.updated = Math.floor(Date.now() / 1000)

                    this.$store.dispatch('send', {
                        cmd: 'setProduct',
                        value: this.product
                    })

                    this.$emit('close')
                }
            },

            onChange(e) {
                e.preventDefault()

                this.change = true

                console.log(this.product)
            },
            setTariffs(ids) {
                this.product.tariff_ids = ids
            },
            setTariffDefault(id) {
                this.product.tariff_default = id
            },
            setCategories(ids) {
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
        margin-top: 60px;
    }
    input {
        width: 100%;
    }
    td {
        padding: 5px;
    }

    .btn-group {
    	margin-top: 20px;
    }
    .products__updated {
        font-size: 12px;
        margin: 20px 0 0 0;
        color: rgba(255, 255, 255, 0.5);
    }
</style>