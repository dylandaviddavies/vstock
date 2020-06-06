import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Chart from 'chart.js';

require('./styles/index.scss');

Chart.defaults.global.defaultFontFamily = "Poppins";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    this.$store.commit('INIT');
  }
}).$mount('#app');