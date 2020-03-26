<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Zaloguj się 🔐</h1>
                <h1 class="d-block d-md-none display-6">Zaloguj się 🔐</h1>
            </div>
        </div>
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-10">
                    <form>
                        <div class="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="form.email"
                                :class="{ 'is-invalid': error }"
                            />
                        </div>
                        <div class="form-group">
                            <label>Hasło</label>
                            <input
                                type="password"
                                class="form-control"
                                v-model="form.password"
                                :class="{ 'is-invalid': error }"
                            />
                            <div v-if="error" class="invalid-feedback">Podaj email oraz hasło</div>
                        </div>
                        <div class="clearfix">
                            <button
                                class="btn btn-primary float-left"
                                @click.prevent="login"
                            >Zaloguj się</button>
                            <router-link
                                to="/forgot-password"
                                tag="a"
                                class="float-right"
                            >Zapomniałem hasła</router-link>
                        </div>
                    </form>
                    <router-link
                        to="/register"
                        tag="a"
                        class="badge badge-info py-2 mt-2"
                    >Nie posiadasz konta? Zarejestruj się!</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { getters, actions } from '../store';
export default {
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            error: false
        };
    },
    computed: {
        ...getters
    },
    methods: {
        ...actions,
        async login() {
            this.error = false;

            if (this.form.email && this.form.password) {
                try {
                    const result = await axios.post(
                        `http://localhost:3000/api/users/login`,
                        this.form
                    );

                    alert('Pomyslnie zalogowano');
                    localStorage.setItem('jwt', result.data.token);
                    await this.fetchLoggedUser();
                } catch (err) {
                    alert('Niepoprawne dane. Spróbuj ponownie');
                }
            } else this.error = true;
        }
    }
};
</script>

<style scoped></style>
