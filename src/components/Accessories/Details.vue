<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="accessory.id_rent">Редактирование аксессуара</span>
                <span v-else>Новый аксессуар</span>
            </h3>

            <form @input="onChange">
                <table>
                    <tr>
                        <td>id</td>
                        <td><input :value="accessory.id_rent" disabled></td>
                    </tr>

                    <tr>
                        <td>Название</td>
                        <td><input v-model="accessory.name"></td>
                    </tr>

                    <tr>
                        <td>Значение</td>
                        <td><input v-model="accessory.value"></td>
                    </tr>

                    <tr>
                        <td>Тип</td>
                        <td><input v-model="accessory.type"></td>
                    </tr>
                </table>
            </form>     
            
            <div class="btn-group">
                <button @click="save" :disabled="!change">Сохранить</button>
                <button @click="close">Отмена</button>
                <button @click="remove" v-if="accessory.id_rent">Удалить</button>      
            </div>

            <div class="details__close" @click="close"></div>     
        </div>
    </div>
</template>

<script>
    import copy from '../../functions/copy'

    export default {
        props: {
            data: Object
        },
        data() {
            return {
                accessory: this.copy(this.data),
                change: false
            }
        },
        methods: {
            ...copy,

            save() {
                this.$store.dispatch('send', [
                    {cmd: 'setAccessory', value: this.accessory},
                ])

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
        margin-top: 10px;
    }
</style>