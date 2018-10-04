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
    import Bike from '../Bike'

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
                palette: [
                    '#ff0000', // красный 
                    '#0600ff', // синий
                    '#397a00', // зеленый
                    '#78ff00', // салатовый
                    '#ff9c00', // оранжевый
                    '#b6b6b6', // серый
                    '#3c3c3b', // черный
                    '#6f00a2', // фиолетовый
                    '#ffffff', // белый
                    '#fcff00', // желтый
                    '#00deff', // голубой
                ]
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
        width: 220px;
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