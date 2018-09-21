<template>
    <div class="select-customer">
        <div class="wrap">
            <input 
                class="select-customer__input"
                id="select_customer__input"
                v-model.trim="input"
                @input="change()"
                @focus="focus()"
                @blur="blur()"
            >
            <div class="del" v-show="input" @click="clear()">✕</div>
        </div>
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
        props: {
            default: null
        },

        created() {
            this.input = this.default ? this.customers.find(i => i.id_rent == this.default).fullname : null
        },

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

            blur() {
                setTimeout(() => {
                    this.show = false
                }, 100)                
            },

            clear() {
                this.input = ''
                select_customer__input.focus()
            },

            change() {
                this.show = true
                this.result = this.search(this.input)
            },

            search(str) {
                return this.input
                    ? this.customers.filter(i => ~i.fullname.indexOf(this.input)) 
                    : this.customers
            },

            select(item) {
                this.input = item.fullname
                this.show = false
                this.$emit('setCustomer', item)
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
        line-height: 20px;
        width: 100%;
        box-sizing: border-box;
        position: relative;
    }
    .wrap {
        margin: 0;
        padding: 0;
        position: relative;
    }
    .del {
        position: absolute;
        width: 14px;
        height: 14px;
        right: 4px;
        top: 4px;
        color: lightgray;
    }
    .del:hover {
        cursor: pointer;
    }

    .result__list {
        margin: 0;
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
    .result__item:hover {
        outline: 1px solid #333;
        cursor: pointer;
    }
</style>