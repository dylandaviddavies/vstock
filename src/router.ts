import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VsDashboard from './components/VsDashboard.vue';
import VsStocks from './components/VsStocks.vue';
import VsNewsPage from './components/VsNewsPage.vue';
import VsStockOverview from './components/VsStockOverview.vue';
import VsTrending from './components/VsTrending.vue';
import VsAccount from './components/VsAccount.vue';
import VsPageNotFound from './components/VsPageNotFound.vue';

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
    path: '/news', component: VsNewsPage
  },
  {
    path: '*', component: VsPageNotFound
  },/*
  {
    path: '/account', component: VsAccount
  }*/
];

export default new VueRouter({
  routes
});