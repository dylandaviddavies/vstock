import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

require('./styles/index.scss');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
	beforeCreate() {
		this.$store.commit('INIT');
	}
}).$mount('#app')