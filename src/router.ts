import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VsDashboard from './components/VsDashboard.vue';
import VsStocks from './components/VsStocks.vue';
import VsNewsPage from './components/VsNewsPage.vue';
import VsStockOverview from './components/VsStockOverview.vue';

const routes = [
  {
    path: '/dashboard', component: VsDashboard
  },
  {
    path: '/stocks', component: VsStocks
  },
  {
    path: '/stock/:symbol', component: VsStockOverview
  },
  {
    path: '/news', component: VsNewsPage
  },
  {
    path: '*', redirect: '/dashboard'
  }
];

export default new VueRouter({
  routes
});