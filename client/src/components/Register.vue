<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Dołącz do nas 📝</h1>
                <h1 class="d-block d-md-none display-6">Dołącz do nas 📝</h1>
            </div>
        </div>
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <form class="pb-2 col-md-10">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Email</label>
                            <input
                                type="text"
                                class="form-control"
                                :class="{
                                    'is-invalid':
                                        errors.email || errors.emailTaken
                                }"
                                placeholder="Email"
                                v-model="form.email"
                                @keyup="validateEmail"
                            />
                            <div v-if="errors.email" class="invalid-feedback">Podaj email</div>
                            <div v-if="errors.emailTaken" class="invalid-feedback">Email jest zajęty</div>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Nazwa użytkownika</label>
                            <input
                                type="text"
                                class="form-control"
                                :class="{
                                    'is-invalid':
                                        errors.username || errors.usernameTaken
                                }"
                                v-model="form.username"
                                @keyup="validateUsername"
                            />
                            <div
                                v-if="errors.username"
                                class="invalid-feedback"
                            >Podaj nazwę użytkownika</div>
                            <div
                                v-if="errors.usernameTaken"
                                class="invalid-feedback"
                            >Nazwa użytkownika jest zajęta</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Hasło</label>
                            <input
                                type="password"
                                class="form-control"
                                :class="{ 'is-invalid': errors.password }"
                                v-model="form.password"
                                @keyup="validatePassword"
                            />
                            <div
                                v-if="errors.password"
                                class="invalid-feedback"
                            >Hasło musi mieć minimum 8 znaków</div>
                            <div
                                v-if="errors.passwordComparision"
                                class="invalid-feedback"
                            >Hasła się nie zgadzają</div>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Powtórz hasło</label>
                            <input
                                type="password"
                                class="form-control"
                                :class="{
                                    'is-invalid':
                                        errors.passwordConfirm ||
                                        errors.passwordComparision
                                }"
                                v-model="form.passwordConfirm"
                                @keyup="validatePassword"
                            />
                            <div
                                v-if="errors.passwordConfirm"
                                class="invalid-feedback"
                            >Powtórz hasło</div>
                            <div
                                v-if="errors.passwordComparision"
                                class="invalid-feedback"
                            >Hasła się nie zgadzają</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Abonent od</label>
                        <input
                            type="date"
                            class="form-control"
                            :class="{ 'is-invalid': errors.unlimited }"
                            v-model="form.unlimited"
                            @mouseleave="validateUnlimited"
                        />
                        <div
                            v-if="errors.unlimited"
                            class="invalid-feedback"
                        >Podaj datę dołączenia do abonamentu</div>
                    </div>
                    <div class="form-group">
                        <label>Region</label>
                        <select class="form-control" v-model="form.region">
                            <option value="rest">poza Warszawą</option>
                            <option value="warsaw">Warszawa</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Zniżka</label>
                        <select class="form-control" v-model="form.discount">
                            <option value="regular">brak</option>
                            <option value="student">studencka / uczniowska</option>
                            <option value="senior">seniora</option>
                            <option value="veteran">weterana</option>
                        </select>
                    </div>
                    <button class="btn btn-primary btn-block" @click="register">Zarejestruj się</button>
                </form>
            </div>
        </div>
        <app-alert :success="true" v-if="showAlert">Rejestracja udana. Możesz się zalogować</app-alert>
    </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert';
export default {
    data() {
        return {
            form: {
                email: '',
                username: '',
                password: '',
                passwordConfirm: '',
                unlimited: null,
                discount: 'regular',
                region: 'rest'
            },
            errors: {
                email: false,
                emailTaken: false,
                username: false,
                usernameTaken: false,
                password: false,
                passwordConfirm: false,
                passwordComparision: false,
                unlimited: false
            },
            showAlert: false
        };
    },
    methods: {
        validateEmail() {
            this.errors.email = false;
            this.errors.emailTaken = false;
            // eslint-disable-next-line no-useless-escape
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!this.form.email || !regex.test(this.form.email)) {
                this.errors.email = true;
            }
        },
        validateUsername() {
            this.errors.username = false;
            this.errors.usernameTaken = false;
            if (!this.form.username) {
                this.errors.username = true;
            }
        },
        validatePassword() {
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
        validateUnlimited() {
            //console.log('validate unlimited');
            this.errors.unlimited = false;
            if (!this.form.unlimited) {
                this.errors.unlimited = true;
            }
        },
        validateForm() {
            let isValid = true;

            this.validateEmail();
            this.validateUsername();
            this.validatePassword();
            this.validateUnlimited();

            for (const error in this.errors) {
                //checking if property is not inherited
                if (Object.prototype.hasOwnProperty.call(this.errors, error)) {
                    //console.log(error + ' : ' + this.errors[error]);
                    if (this.errors[error] === true) {
                        isValid = false;
                        break;
                    }
                }
            }
            return isValid;
        },
        async register(event) {
            event.preventDefault();
            const isValid = this.validateForm();

            if (isValid) {
                const result = await axios.post(
                    `http://localhost:3000/api/users/register`,
                    this.form
                );

                if (result.data.status === 'error') {
                    if (result.data.message === 'Email is already taken')
                        this.errors.emailTaken = true;

                    if (result.data.message === 'Username is already taken')
                        this.errors.usernameTaken = true;
                } else {
                    //TODO alert registration succesfull, and clear form
                    this.clearForm();
                    //alert('Rejestracja udana');
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 2000);
                }
            }
        },
        clearForm() {
            Object.keys(this.form).forEach(key => (this.form[key] = ''));
            this.form.unlimited = null;
            this.form.discount = 'regular';
            Object.keys(this.errors).forEach(key => (this.errors[key] = false));
        }
    },
    components: {
        appAlert: Alert
    }
};
</script>

<style scoped></style>
