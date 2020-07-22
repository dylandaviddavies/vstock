import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VsDashboard from './views/VsDashboard.vue';
import VsStocks from './views/VsStocks.vue';
import VsNews from './views/VsNews.vue';
import VsStockOverview from './views/VsStock.vue';
import VsTrending from './views/VsTrending.vue';
import VsAccount from './views/VsAccount.vue';
import Vs404 from './views/Vs404.vue';

const routes = [
  {
    path: '/dashboard', component: VsDashboard
  },
  {
    path: '/', redirect: '/dashboard'
  },
  {
    path: '/stocks', component: VsStocks
  },
  {
    name: "stock", path: '/stock/:symbol', component: VsStockOverview
  },
  {
    path: '/trending', component: VsTrending
  },
  {
    path: '/news', component: VsNews
  },
  {
    path: '*', component: Vs404
  },/*
  {
    path: '/account', component: VsAccount
  }*/
];

export default new VueRouter({
  routes
});