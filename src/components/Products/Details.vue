<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="!product.newProduct">Редактирование товара</span>
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
                        <td>Фото</td>
                        <td>
                            <label class="product__photo--label">
                                <template>
                                    <Photo 
                                        class="details__photo" 
                                        v-if="product.img" 
                                        :product="product" 
                                        :refresh="refresh"
                                    ></Photo>
                                    <div v-else class="button">Добавить фото</div>    
                                </template>
                                <input class="photo__input" type="file" @input="addImage($event)">
                            </label>
                            <span class="details__status">{{ uploadStatus }}</span>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>Иконка</td>
                        <td class="bikes">
                            <div @click="setType(1)">
                                <Bike
                                    class="bike"
                                    :class="{ bike__active: product.type == 1}"
                                    :style="{ borderColor: product.color }"
                                    :_color="product.color" 
                                    :_type="1"                                    
                                >
                                </Bike>                                
                            </div>
                            <div @click="setType(2)">
                                <Bike
                                    class="bike"
                                    :class="{ bike__active: product.type == 2}"
                                    :style="{ borderColor: product.color }"
                                    :_color="product.color" 
                                    :_type="2"                                    
                                > 
                                </Bike>                                
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Цвет</td>
                        <td><Palette :_color="data.color" @setColor="setColor($event)"></Palette></td>
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
                <!--<tr>
                        <td>Категории</td>
                        <td>
                            <Categories :data="product.categories" @setCategories="setCategories($event)"></Categories>
                        </td>
                    </tr> -->
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
    import copy         from '@/functions/copy'
    import getExtention from '@/functions/getExtention'
    import uploads      from '../func/user_uploads'

    import Tariffs    from './prod_tariffs'
    import Categories from './prod_categories'
    import Palette    from './Palette'
    import Bike       from '../Bike'
    import Photo      from '../Photo'


    export default {
        props: {
            data: Object // Product
        },
        components: {
            Tariffs,
            Categories,

            Palette,
            Bike,
            Photo,
        },
        data() {
            return {
                product: copy(this.data),
                change: false,
                uploadStatus: '',
                refresh: false
            }
        },
        methods: {
            check() {
                if (!this.product.name) {
                    console.log('empty product name')
                    return false
                }
                if (!this.product.tariff_ids) {
                    console.log('empty tariffs')
                    return false
                }
                if (!this.product.tariff_default) {
                    console.log('empty tariff default')
                    return false
                }

                return true
            },

            async addImage(e) {
                const file = e.target.files[0]
                const time = Math.floor(Date.now() / 1000)
                const ext = getExtention(file.type)
                const name = `${this.$store.getters.appID}_${this.product.id_rent}_${time}${ext}`

                const formData = new FormData()

                formData.set('file', file, name)
                this.uploadStatus = 'Загрузка ...'
                
                const result = await uploads(formData, this.$store)

                if (result) {
                    this.uploadStatus = 'Загрузка завершена'
                    this.product.img = `${time}${ext}`
                } 

                this.refresh = true     
            },

            save() {
                this.product.updated = Math.floor(Date.now() / 1000)

                //console.log(this.product)

                if (!this.check()) {
                    return
                }

                this.$store.dispatch('send', {
                    cmd: 'setProduct',
                    value: this.product
                })

                this.$emit('close')
            },
            close() {
                console.log('close')
                if (!this.change) {
                    this.$emit('close')
                    return
                }

                if (confirm('Изменения не сохранены. Вы уверены, что хотите выйти?')) {
                    this.$emit('close')
                }
            },
            remove() {
                if (confirm('Вы уверены, что хотите безвозвратно удалить товар?')) {
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
                this.product.tariff_ids = ids
            },
            setTariffDefault(id) {
                this.product.tariff_default = id
            },
            setCategories(ids) {
                this.product.categories = ids
            },
            setColor(color) {
                this.product.color = color
                this.change = true
            },
            setType(type) {
                this.product.type = type
                this.change = true
            }
        },
        computed: {
            tariffs() {
                return this.$store.getters.tariffs
            },
            categories() {
                return this.$store.getters.categories
            },
        }
    }
</script>

<style scoped>
    .details {
        width: 370px;
        margin-top: 30px;
        overflow-y: hidden;
    }
    input {
        width: 200px;
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
    .bikes {
        display: flex;
    }
    .bike {
        padding: 5px;
        margin-left: 10px;
    }
    .bike__active {
        border-bottom: 2px solid lightgray;
    }

    .details__photo {
        position: relative;
        width: 120px;
        height: 90px;
    }
    .details__photo:hover {
        cursor: pointer;
    }
    .photo__input {
        display: none;
    }
    .details__status {
        font-size: 10px;
    }
    .product__photo--label {
        display: flex;
        flex-direction: row;

    }

</style>