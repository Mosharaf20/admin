/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


window.Vue = require('vue');

//V-form
import { Form, HasError, AlertError } from 'vform';
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

//custom gate
import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);

//moment js
import moment from 'moment';

//v-progress bar
import VueProgressBar from 'vue-progressbar';
const options = {
    color: 'green',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.02s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
};
Vue.use(VueProgressBar, options);

//sweet alert
import Swal from 'sweetalert2';
window.Swal = Swal;


//vue router set
import VueRouter from 'vue-router'
Vue.use(VueRouter);

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
window.Toast = Toast;

//custom event
let Fire = new Vue();
window.Fire = Fire;

//vue router all path
const routes = [
    { path: '/profile', component: require('./components/ProfileComponent.vue').default},
    { path: '/dashboard', component: require('./components/DashboardComponent.vue').default},
    { path: '/user', component: require('./components/UserComponent.vue').default},
    { path: '/developer', component: require('./components/DeveloperComponent.vue').default},
    { path: '*', component: require('./components/NotFoundComponent.vue').default},
];

//passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

//not Found undraw
Vue.component(
    'not-found',
    require('./components/NotFoundComponent.vue').default
);

//laravel vue pagination
Vue.component('pagination', require('laravel-vue-pagination'));

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

//vue global filter
Vue.filter('capitalize', function (value) {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1)
});


Vue.filter('myDate',function(created){
    return moment(created).format("MMM Do YY");
});

const app = new Vue({
    router,
    el: '#app',
    data:{
        keyword:''
    },
    methods:
    {
        searching:_.debounce(()=>{
            Fire.$emit('searchData')
        },500)
    }
});
