import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './routes';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';
import App from './App.vue';
import { apiKey } from './config';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ion-/];

Vue.use(VueRouter);

Vue.use(Chartkick.use(Chart));
Vue.use(Chartkick);
Chartkick.configure({ language: 'en', mapsApiKey: apiKey });

const router = new VueRouter({ mode: 'history', routes });

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
