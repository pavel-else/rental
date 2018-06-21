<template>
    <div>       
        <div>Часов откатано: <input type="text" v-model="h"></div>
        <div>Стоимость проката: {{ result }}</div>
        <button @click="onClick">TEST</button>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'test',

        data() {
            return {
                result: null,
                h: 0,
                tariff: [0, 120, 100, 80, 80, 80, 80]
            }
        },

        methods: {
            onClick() {
                this.result = this.getBill(this.h)
            },

            getBill(h) {
                const tariffs = this.$store.getters.tariffs
                const tariff = tariffs[1]
                const min = 0.5
                const min$ = 60
                const max = 500


                let result = 0

                if (h <= min) {
                    return min$
                }

                if (h < 1) {
                    return h * this.tariff[1]
                }

                for (let i = 1; i <= h; i++) {
                    result += this.tariff[i]
                    if (result >= max) {
                        return max
                    }
                }
                
                const i = (h - Math.floor(h)).toFixed(2)
                const bill_min = i * this.tariff[Math.ceil(h)]
                console.log(bill_min)

                return (result + bill_min) < max ? result + bill_min : max

            }                                
        },
        computed: {
            res() {
                return this.result
            }
        }
    }
</script>