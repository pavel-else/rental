<template>
    <div class="product-list">
        <h3>Свободныe</h3>
        <table class="table table-bordered">
            <tr
                v-for="(item, index) in filterProducts" 
                @click="onClick(item)" 
                class="products__product"
            >
                <td class="products__td products__td--icon">
                    <Bike :color="item.color"></Bike>
                </td>

                <td class="products__td">{{ item.name }}</td>
            </tr>
        </table>
                    
    </div>
</template>

<script>
    import Bike   from '../Bike'
    import Resume from './Resume'

    export default {
        components: {
            Bike,
            Resume
        },
        methods: {
            onClick(item) {
                this.$emit('addOrder', item)
            }
        },
        computed: {
            filterProducts() {
                const list = this.$store.getters.products

                return list ? list.filter(item => item.status == 'free') : []
            },
        },
        directives: {
            focus: {
                inserted(el) {
                    el.focus()
                }
            },
            ondelay: {
                bind(el, options) {
                    let timer
                    let timeOut = 0

                    for (let name in options.modifiers) {
                        if (!isNaN(+name)) {
                            timeOut = parseInt(name)
                        } 
                    }

                    let callback = (e) => {
                        if (timer !== undefined) {
                            clearInterval(timer)
                        }

                        if (options.modifiers.prevent) {
                            e.preventDefault()
                        }

                        timer = setTimeout( () => {
                            options.value.call(this, e)
                        }, timeOut)
                    }

                    el.addEventListener(options.arg, callback)                    
                }
            }
        }

    }
</script>

<style scoped>
    .products__td {
        padding: 0px 0px 10px 5px;
    }
    .products__product:hover {
        cursor: pointer;
        outline: 1px solid #333;
    }
</style>