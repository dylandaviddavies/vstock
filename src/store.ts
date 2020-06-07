import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		subscribedSymbols: Array<string>()
	},
	actions: {
		unsubscribeStock({ commit }, symbol) {
			commit('UNSUBSCRIBE_STOCK_SYMBOL', symbol);
		}
	},
	mutations: {
		UNSUBSCRIBE_STOCK_SYMBOL(state, symbol) {
			var index = state.subscribedSymbols.indexOf(symbol);
			if (index !== -1) state.subscribedSymbols.splice(index, 1);
		},
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