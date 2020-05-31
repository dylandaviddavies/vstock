import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    subscribedSymbols: [
      'tsla',
      'fb',
      'aapl',
      'ea'
    ]
  },
	mutations: {
		INIT(state) {
			if(localStorage.getItem('store')) {
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				);				
			}
		}
	},
});
store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify(state));
});
export default store;