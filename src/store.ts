import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		subscribedSymbols: Array<string>(),
		maxSymbols: 8,
		toasts: Array<string>()
	},
	actions: {
		unsubscribeStock({ commit }, symbol) {
			commit('UNSUBSCRIBE_STOCK_SYMBOL', symbol);
		},

		subscribeStock({ commit }, symbol) {
			commit('SUBSCRIBE_STOCK_SYMBOL', symbol);
		},

		popToast({ state }) {
			if (state.toasts.length === 0)
				return;
			return state.toasts.shift();
		},

		addToast({ commit }, toast) {
			commit('ADD_TOAST', toast);
		}
	},
	mutations: {
		UNSUBSCRIBE_STOCK_SYMBOL(state, symbol) {
			var index = state.subscribedSymbols.indexOf(symbol);
			if (index !== -1) state.subscribedSymbols.splice(index, 1);
		},

		SUBSCRIBE_STOCK_SYMBOL(state, symbol) {
			if (state.subscribedSymbols.includes(symbol))
				return;
			state.subscribedSymbols.push(symbol);
		},

		ADD_TOAST(state, toast) {
			state.toasts.push(toast);
		},

		REMOVE_TOAST(state, toast) {
			state.toasts.push(toast);
		},

		INIT(state) {
			let storeJson = localStorage.getItem('store');
			if (storeJson) {
				let store = JSON.parse(storeJson);
				state.subscribedSymbols = store.subscribedSymbols;
			}
		}
	},
});
store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify({
		subscribedSymbols: state.subscribedSymbols
	}));
});
export default store;