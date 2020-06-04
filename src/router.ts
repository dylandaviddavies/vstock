import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VsDashboard from './components/VsDashboard.vue';
import VsStocks from './components/VsStocks.vue';

const routes = [
  {
    path: '/dashboard', component: VsDashboard
  },
  {
    path: '/stocks', component: VsStocks
  },
  {
    path: '*', redirect: '/dashboard'
  }
];

export default new VueRouter({
  routes
});