import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		subscribedSymbols: Array<string>()
	},
	mutations: {
		SUBSCRIBE_STOCK_SYMBOL(state, symbol) {
			state.subscribedSymbols.push(symbol);
		},
		INIT(state) {
			let storeJson = localStorage.getItem('store');
			if (storeJson) {
				this.replaceState(
					Object.assign(state, JSON.parse(storeJson))
				);
			}
		}
	},
});
store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify(state));
});
export default store;