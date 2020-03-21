import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import ResetPassword from './components/ResetPassword.vue';

export const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password/:token', component: ResetPassword }
];
