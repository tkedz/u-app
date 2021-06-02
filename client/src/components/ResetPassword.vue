<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Resetowanie hasła 🔑</h1>
                <h1 class="d-block d-md-none display-6">Resetowanie hasła 🔑</h1>
                <p class="lead">Podaj nowe hasło</p>
            </div>
        </div>
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-10">
                    <form>
                        <div class="form-group">
                            <label>Hasło</label>
                            <input
                                type="password"
                                class="form-control"
                                :class="{
                                    'is-invalid':
                                        errors.password ||
                                        errors.passwordComparision
                                }"
                                v-model="form.password"
                                @keyup="validatePasswords"
                            />
                        </div>
                        <div class="form-group">
                            <label>Powtórz hasło</label>
                            <input
                                type="password"
                                class="form-control"
                                :class="{
                                    'is-invalid':
                                        errors.password ||
                                        errors.passwordComparision
                                }"
                                v-model="form.passwordConfirm"
                                @keyup="validatePasswords"
                            />
                            <div
                                v-if="errors.password"
                                class="invalid-feedback"
                            >Podaj hasło (min. 8 znaków)</div>
                            <div
                                v-if="errors.passwordComparision"
                                class="invalid-feedback"
                            >Hasła się nie zgadzają</div>
                        </div>
                        <button
                            class="btn btn-primary float-left"
                            @click.prevent="resetPassword"
                        >Wyślij</button>
                        <router-link
                            to="/forgot-password"
                            tag="a"
                            class="badge badge-info float-right"
                        >Wygeneruj nowy token</router-link>
                    </form>
                </div>
            </div>
        </div>
        <app-alert v-if="showSuccessAlert" :success="true">Hasło zresetowane</app-alert>
        <app-alert v-if="showErrorAlert" :success="false">Nie udało się zmienić hasła. Token wygasł</app-alert>
    </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert';
import { proxy } from '../config';
export default {
    data() {
        return {
            form: {
                password: '',
                passwordConfirm: ''
            },
            errors: {
                password: false,
                passwordComparision: false
            },
            showSuccessAlert: false,
            showErrorAlert: false
        };
    },
    methods: {
        validatePasswords() {
            this.errors.password = false;
            this.errors.passwordConfirm = false;

            if (!this.form.password || this.form.password.length < 8) {
                this.errors.password = true;
            }
            if (!this.form.passwordConfirm) {
                this.errors.passwordConfirm = true;
            }
            if (this.form.passwordConfirm !== this.form.password) {
                this.errors.passwordComparision = true;
            } else {
                this.errors.passwordComparision = false;
            }
        },
        async resetPassword() {
            this.errors.password = false;
            this.validatePasswords();

            if (!this.errors.password && !this.errors.passwordComparision) {
                try {
                    await axios.patch(
                        // `http://localhost:3000/api/users/reset-password/${this.$route.params.token}`,
                        `${proxy}api/users/reset-password/${this.$route.params.token}`,
                        this.form
                    );

                    //alert('Hasło zresetowane');
                    this.showSuccessAlert = true;
                    setTimeout(() => {
                        this.showSuccessAlert = false;
                    }, 2000);
                } catch (err) {
                    //alert('Nie udało się zmienić hasła. Token wygasł');
                    this.showErrorAlert = true;
                    setTimeout(() => {
                        this.showErrorAlert = false;
                    }, 2000);
                }
            }
        }
    },
    components: {
        appAlert: Alert
    }
};
</script>

<style scoped></style>
