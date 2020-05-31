import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VcDashboard from './components/VcDashboard.vue';
import VcStocks from './components/VcStocks.vue';

const routes = [
  {
    path: '/dashboard', component: VcDashboard
  },
  {    
    path: '/stocks', component: VcStocks
  },
  {
    path: '*', redirect: '/stocks'
  }
];

export default new VueRouter({
  routes
});