//vue router set
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//vue router all path
const routes = [
    { path: '/profile', component: require('./components/ProfileComponent.vue').default},
    { path: '/dashboard', component: require('./components/DashboardComponent.vue').default}
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
});

const app = new Vue({
    router
}).$mount('#app')
