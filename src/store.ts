import { Stock, User } from './types';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var store = new Vuex.Store({
	state: {
		v: 2,
		subbedStocks: Array<Stock>(
			new Stock({ symbol: "MSFT" }),
			new Stock({ symbol: "DIS" }),
			new Stock({ symbol: "SNE" }),
			new Stock({ symbol: "GOOGL" }),
			new Stock({ symbol: "BA" }),
			new Stock({ symbol: "V" }),
			new Stock({ symbol: "TSLA" })
		),
		maxSymbols: 8,
		toasts: Array<string>(),
		user: new User({
			name: "User",
		})
	},
	actions: {
		getSubbedStockBySymbol({ state }, symbol) {
			return state.subbedStocks.find(s => s.symbol === symbol);
		},

		unsubscribeStockBySymbol({ commit, dispatch }, symbol) {
			dispatch("getSubbedStockBySymbol", symbol).then((stock: Stock) => commit('UNSUBSCRIBE_STOCK', stock));
		},

		subscribeStock({ commit }, stock: Stock) {
			commit('SUBSCRIBE_STOCK', stock);
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
		RESET_STATE(state) {
			state.subbedStocks = new Array<Stock>();
		},

		UNSUBSCRIBE_STOCK(state, stock) {
			var index = state.subbedStocks.indexOf(stock);
			if (index !== -1) state.subbedStocks.splice(index, 1);
		},

		SUBSCRIBE_STOCK(state, stock) {
			let index = state.subbedStocks.findIndex(s => s.symbol === stock.symbol);
			if (index === -1)
				state.subbedStocks.push(stock);
			else
				state.subbedStocks[index] = stock;
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
				if (store.v == null || store.v !== state.v) {
					localStorage.removeItem("store");
				} else {
					state.subbedStocks = store.subbedStocks;
				}
			}
		}
	},
});
store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify({
		subbedStocks: state.subbedStocks,
		v: state.v
	}));
});
export default store;