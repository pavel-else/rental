<template> 
    <div class="palette">        
        <div @click="open = true">
            <Bike :color="selectColor"></Bike>
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
                open: false,
                palette: ['#333', '#fff', '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8b00ff']
            }
        },
        methods: {
            onClick(color) {
                this.selectColor = color
                this.open = false
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
        margin: 2px 0 0 10px;
        padding: 0;
        height: 16px;
        width: 180px;

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