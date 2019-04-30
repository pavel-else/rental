<template>
    <div class="canvas">
        <div class="details">
            <h3>
                <span v-if="accessory.id_rent">Редактирование аксессуара</span>
                <span v-else>Новый аксессуар</span>
            </h3>

            <form @input="onChange">
                <table>
                    <tr v-if="accessory.is_new">
                        <td>id</td>
                        <td><span>{{ accessory.id_rent }}</span></td>
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
                        <!-- <td><input v-model="accessory.type"></td> -->
                        <td>
                            <div class="wrap">
                                <input id="access__type_rub" type="radio" value="rub" name="type" v-model="accessory.type"> 
                                <label for="access__type_rub">руб</label>

                                <input id="access__type_per" type="radio" value="%" name="type" v-model="accessory.type">
                                <label for="access__type_per">%</label>
                            </div>
                        </td>
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
    import copy from '@/functions/copy';

    export default {
        props: {
            payload: Object
        },
        data() {
            return {
                accessory: copy(this.payload),
                change: false
            }
        },
        methods: {
            save() {
                this.$store.dispatch('setAccessory', this.accessory);
                this.$emit('close');
            },
            close() {                
                if (!this.change) {
                    this.$emit('close');
                    return;
                }

                if (confirm('Изменения не сохранены. Вы уверены, что хотите выйти?')) {
                    this.$emit('close');
                }
            },
            remove() {
                if (confirm(`Вы действительно хотите удалить тариф '${ this.accessory.name }'?`)) {
                    this.$store.dispatch('deleteAccessory', this.accessory.id_rent);
                    this.$emit('close');
                }
            },

            onChange(e) {
                e.preventDefault();
                this.change = true;
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

    .wrap {
        display: inline-flex;
        width: 100%;
        justify-content: flex-start;
    }
    .wrap label {
        margin-right: 20px;
    }

    .btn-group {
        margin-top: 10px;
    }
</style>