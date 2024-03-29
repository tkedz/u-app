import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import ResetPassword from './components/ResetPassword.vue';
import UserProfile from './components/UserProfile.vue';
import Search from './components/Search.vue';
import MovieDetails from './components/MovieDetails.vue';
import NotFound from './components/NotFound';

export const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password/:token', component: ResetPassword },
    { path: '/users/:username', component: UserProfile },
    { path: '/search', component: Search },
    { path: '/movies/:id', component: MovieDetails },
    { path: '*', component: NotFound }
];
