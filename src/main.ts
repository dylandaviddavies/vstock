import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Chart from 'chart.js';

import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

import VueProgressBar from 'vue-progressbar';
Vue.use(VueProgressBar, {
  color: 'var(--color-primary)',
  failedColor: 'var(--color-error)',
  height: '2px'
});

require('./styles/index.scss');

Chart.defaults.global.defaultFontFamily = "Varela Round";
Chart.defaults.global.defaultFontColor = '#5a6f86';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    this.$store.commit('INIT');
  }
}).$mount('#app');