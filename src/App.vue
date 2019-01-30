<template> 
    <div class="app black">
        <div class="app__wrap">
            <span class="app__branch" v-if="dev">β</span>
            <adm-panel class="adm"></adm-panel>
            <router-view></router-view>        
        </div>
    </div>
</template>

<script>    
    import admPanel from './components/AdmPanel'

    export default {
        name: 'app',

        components: {
            admPanel,
        },

        beforeCreate () {
            if (this.$store.getters.isAuthenticated) {
                this.$store.dispatch('INIT_APP');
            }
        },
        created() {
            // Обновление таймеров
            this.$store.dispatch('startTimer');

            // console.log(this.$router.matcher)
        },
        computed: {
            dev() {
                return this.$store.getters.activeBranch === 'dev'
            }
        }
    }

</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');

    html, body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    body {
        font-family: 'Roboto Condensed', sans-serif;
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);
    }

    button, i, input, ul, li {
        font-family: Roboto Condensed;
        font-size: 14px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.8);
    }

    a:hover {
        text-decoration: underline;
    }

    button, .button {
        border: none;
        border-radius: 5px;
        padding: 5px 15px;
        margin-right: 10px;
        display: inline-flex;
    }


    button:hover {
        cursor: pointer;
    }

    input {
        background-color: #000;
        border: 1px solid #333;
        color: rgba(255, 255, 255, 0.8);
        padding: 5px;
        font-family: 
    }

    .checkbox {
        display: none;
    }

    .checkbox + label {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        border: 1px solid #333;
        width: 14px;
        height: 14px;
    }

    .checkbox:checked + label::before {
        display: block;
        position: absolute;
        content: '';
        left: 1px;
        top: 2px;
        width: 8px;
        height: 4px;
        border-left: 2px solid rgba(255, 255, 255, 0.8);
        border-bottom: 2px solid rgba(255, 255, 255, 0.8);
        transform: rotate(-45deg);
    }

    .radio {
        display: none;
    }
    .radio + label {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        border: 2px solid #333;
        width: 14px;
        height: 14px;
        border-radius: 50%;
    }

    .radio:checked + label {
        background-color: #333;
        border-color: lightgray;
    }

    select {
        padding:3px;
        margin: 0;
        background: #000;
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid #333;
        outline: none;

        cursor: pointer;
        width: 100%;
    }

    .white button {
        background-color: rgba(255, 255, 255, 0.8);
        border: 3px solid lightgray;
        color: #333;
    }
    button, .button{
        background-color: #000;
        border: 3px solid #333;
        color: rgba(255, 255, 255, 0.8);
    }
    button:hover, .button:hover {
        cursor: pointer;
        border: 3px solid rgba(255, 255, 255, 0.8);
    }



    .app {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .app.black {
        background-color: #000;
        color: rgba(255, 255, 255, 0.8);        
    }
    .app.white {
        background-color: rgba(255, 255, 255, 0.8);
        color: rgba(0, 0, 0, 0.8);        
    }

    .app__wrap {
        width: 960px;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .tmp {
        outline: 1px solid lightgray;
    }

    .canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .black .canvas {
        background-color: rgba(0, 0, 0, 0.8);        
    }    
    .white .canvas {
        background-color: rgba(255, 255, 255, 0.7);        
    }

    .details {
        position: relative;
        min-width: 300px;
        padding: 5px 10px 10px;
    }
    .black .details {
        border: 1px solid #333;
        background-color: #000;
        box-shadow: 0 2px 5px 0px #000;       
    }
    .white .details {
        border: 1px solid lightgray;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 5px 0px;       
    }

    .details__close {
        margin: 0;
        padding: 0;
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
        border: 2px solid lightgray;
    }

    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 7px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
    }

    .adm {
        position: relative;
    }
</style>

<!-- <template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
 -->