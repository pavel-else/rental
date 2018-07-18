<template>
    <div class="h tmp">
        <table>
            <tr class="h__item" v-for="(value, key) in H">

                <td class="h__caption">
                    {{ key + 1 }}<span v-if="more(key)">+</span> час
                </td>
                <td>
                    <input class="h__input" :value="value">
                </td>
            </tr>
        </table>
        <div class="h__button-group">
            <button class="h__button h__button--add" @click="addH">+</button>
            <button class="h__button h__button--rm" @click="remove">-</button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            h: Array
        },
        data() {
            return {
                H: h
            }
        },
        methods: {
            addH() {
                this.H.push('')
            },
            remove() {
                this.H.pop()
                this.$emit('onChange', this.H)
            },

            more(key) {
                return key + 1 === this.H.length
            }
        }

    }
</script>
<style scoped>
    .h {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .h__item {


    }
    .h__caption {
        text-align: left;
    }
    .h__input {
        text-align: center;
        width: 40px;
    }

    .h__button {
        opacity: 0.2;
        margin: 0 10px;
    }
    .h__button-group {        
        width: 100%;
        display: flex;
    }
    .h__button-group:hover .h__button {
        opacity: 1;
    }

</style>