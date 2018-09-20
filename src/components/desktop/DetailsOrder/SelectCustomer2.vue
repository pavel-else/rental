<template>
    <div class="select-customer">
        <input 
            class="select-customer__input"
            v-model.trim="input"
            @input="change()"
            @focus="focus()"
        >
        <ul class="result__list" v-if="show">
            <li 
                class="result__item"
                v-for="item in result"
                @click="select(item)" 
            >
                {{ item.fullname }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                input: null,
                result: [],
                show: false
            }
        },
        methods: {
            focus() {
                this.change()
            },
            change() {
                this.result = this.search(this.input)
                this.show = true
            },

            search(str) {
                return this.input 
                    ? this.customers.filter(i => ~i.fullname.indexOf(this.input)) 
                    : this.customers
            },

            select(item) {
                console.log(item)
                this.input = item.fullname
                this.show = false
            }
        },
        computed: {
            customers() {
                return this.$store.getters.customers.map(i => {
                    const fname = i.fname ? i.fname : ''
                    const sname = i.sname ? i.sname : ''
                    const tname = i.tname ? i.tname : ''

                    i.fullname = `${fname} ${sname} ${tname}`.trim()

                    return i
                })
            }
        }
    }
</script>

<style scoped>
    .select-customer {
        position: relative;
    }
    .select-customer__input {
        width: 100%;
        box-sizing: border-box;
    }
    .result__list {
        position: absolute;
        z-index: 20;
        width: 100%;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: scroll;

        border: 1px solid #333;
        background-color: #000;
    }
    .result__item {
        display: block;
        padding: 5px 10px;
    }
</style>