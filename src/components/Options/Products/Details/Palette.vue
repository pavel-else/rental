<template> 
    <div class="palette">        
        <div @click="open = true">

            <!-- <Bike :color="selectColor"></Bike> -->

        </div>            

        <ul class="colors" v-if="open">
            <li 
                class="color" 
                :style="{borderColor: color}" 
                v-for="color in palette"
                @click="onClick(color)"
            >                    
            </li>            
        </ul>
    </div>
</template>

<script>
    import Bike from '../../../Bike'

    export default {
        props: {
            _color: String
        },
        components: {
            Bike
        },
        data() {
            return {
                selectColor: this._color,
                open: true,
                palette: ['#fff', '#FF7673', '#FFAD40', '#FFE873', '#CCF600', '#66A3D2', '#0B61A4', '#886ED7', '#D25FD2','#333']
            }
        },
        methods: {
            onClick(color) {
                this.selectColor = color
                // this.open = false
                this.$emit('setColor', color)
            },
        }
    }
</script>

<style scoped>
    .palette {
        display: flex;
        height: 25px;
        width: 230px;
    }
    .colors {
        display: flex;
        margin: 0;
        padding: 0;
        height: 16px;
        width: 200px;
    }
    .color {
        display: block;
        box-sizing: border-box;
        margin: 0 2px;
        padding: 0;
        width: 16px;
        height: 16px;
        line-height: 10px;
        border: 2px solid #333;
        border-radius: 3px;
    }
    .color:hover {
        cursor: pointer;
    }

</style>