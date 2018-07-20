<template>
    <div class="list">
        <table>
            <tr v-for="tariff in tariffs">
                <td>
                    <input type="checkbox" v-model="tariff.check">
                </td>
                <td>{{ tariff.name }}</td>
            </tr>
        </table>
        <button class="list__button" @click="save">Сохранить</button>
    </div>
</template>

<script>
    export default {
        props: {
            data: Array //ids
        },
        data() {
            return {
                tariffs: this.$store.getters.tariffs.map(tariff => {
                    tariff.check = this.data.find(id => id === tariff.id_rent)

                    return tariff
                })
            }
        },
        methods: {
            save(e) {
                e.preventDefault()

                this.$emit('onSet', this.tariffs.reduce((acc, tariff) => {
                    if (tariff.check) {
                        acc.push(tariff.id_rent)
                    }

                    return acc
                },[]))

            }
        },
        computed: {
        }
    }

</script>

<style scoped>
    .list__button {
        width: 100%;
    }
</style>