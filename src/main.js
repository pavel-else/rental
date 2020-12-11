import Vue      from 'vue';
import App      from './App.vue';
import router   from './router';
import store    from './store';
import Vuetify from 'vuetify';

import dayjs from 'dayjs';


const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

Vue.use(Vuetify);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')