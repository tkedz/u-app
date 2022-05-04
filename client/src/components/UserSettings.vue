<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <form>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Nowe hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{
                                'is-invalid': errors.passwordForm.newPassword
                            }"
                            v-model="passwordForm.newPassword"
                            @keyup="validateNewPassword"
                        />
                        <div
                            v-if="errors.passwordForm.newPassword"
                            class="invalid-feedback"
                        >Hasło musi mieć minimum 8 znaków</div>
                        <div
                            v-if="errors.passwordForm.newPasswordComparision"
                            class="invalid-feedback"
                        >Hasła się nie zgadzają</div>
                    </div>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Powtórz hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{
                                'is-invalid':
                                    errors.passwordForm.newPasswordConfirm ||
                                    errors.passwordForm.newPasswordComparision
                            }"
                            v-model="passwordForm.newPasswordConfirm"
                            @keyup="validateNewPassword"
                        />
                        <div
                            v-if="errors.passwordForm.newPasswordConfirm"
                            class="invalid-feedback"
                        >Powtórz hasło</div>
                        <div
                            v-if="errors.passwordForm.newPasswordComparision"
                            class="invalid-feedback"
                        >Hasła się nie zgadzają</div>
                    </div>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Obecne hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{
                                'is-invalid':
                                    errors.passwordForm.currentPassword
                            }"
                            v-model="passwordForm.currentPassword"
                            @keyup="validateNewPassword"
                        />
                        <div
                            v-if="errors.passwordForm.currentPassword"
                            class="invalid-feedback"
                        >Podaj obecne hasło</div>
                        <button
                            class="btn btn-primary mt-3 btn-block"
                            @click.prevent="changePassword"
                        >Zmień hasło</button>
                    </div>
                </form>
                <hr class="bg-warning col-md-8 offset-md-2" />
                <form>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Nowy email</label>
                        <input
                            type="text"
                            class="form-control"
                            :class="{
                                'is-invalid':
                                    errors.emailForm.email ||
                                    errors.emailForm.emailTaken
                            }"
                            v-model="emailForm.email"
                            @keyup="validateEmail"
                        />
                        <div
                            v-if="errors.emailForm.email"
                            class="invalid-feedback"
                        >Email nieprawidłowy</div>
                        <div
                            v-if="errors.emailForm.emailTaken"
                            class="invalid-feedback"
                        >Podany email jest zajęty</div>
                    </div>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{ 'is-invalid': errors.emailForm.password }"
                            v-model="emailForm.password"
                            @keyup="validateEmail"
                        />
                        <div v-if="errors.emailForm.password" class="invalid-feedback">Podaj hasło</div>
                        <button
                            class="btn btn-primary mt-3 btn-block"
                            @click.prevent="changeEmail"
                        >Zmień email</button>
                    </div>
                </form>
                <hr class="bg-warning col-md-8 offset-md-2" />
                <form>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Zdjęcie</label>
                        <input
                            id="fileInput"
                            class="form-control"
                            :class="{ 'is-invalid': errors.file }"
                            type="file"
                            @change="onFileSelected"
                            accept="image/*"
                        />
                        <div class="invalid-feedback" v-if="errors.file">Wybierz zdjęcie</div>
                        <button
                            class="btn btn-primary mt-3 btn-block"
                            @click.prevent="changeUserPhoto"
                        >Zmień zdjęcie</button>
                    </div>
                </form>
                <hr class="bg-warning col-md-8 offset-md-2" />
                <form>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Data dołączenia do abonamentu</label>
                        <datepicker
                            v-model="unlimitedForm.unlimited"
                            :bootstrap-styling="true"
                            @input="errors.unlimited = false"
                        ></datepicker>
                        <div
                            v-if="errors.unlimited"
                            class="text-danger"
                        >Podaj datę dołączenia do abonamentu</div>
                    </div>
                    <div class="form-group col-md-8 offset-md-2">
                        <label>Zniżka</label>
                        <select class="form-control" v-model="unlimitedForm.discount">
                            <option value="regular">brak</option>
                            <option value="student">studencka / uczniowska</option>
                            <option value="senior">seniora</option>
                            <option value="veteran">weterana</option>
                        </select>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            @click.prevent="changeUnlimited"
                        >Zmień dane o abonamencie</button>
                    </div>
                </form>
            </div>
        </div>
        <app-alert v-if="showSuccessAlert" :success="true">{{alertMessage}}</app-alert>
        <app-alert v-if="showErrorAlert" :success="false">{{alertMessage}}</app-alert>
    </div>
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import Alert from './Alert';
import { proxy } from '../config';
export default {
    props: ['user'],
    data() {
        return {
            passwordForm: {
                newPassword: '',
                newPasswordConfirm: '',
                currentPassword: ''
            },
            emailForm: {
                email: this.user.email,
                password: ''
            },
            unlimitedForm: {
                unlimited: this.user.unlimited,
                discount: this.user.discount
            },
            errors: {
                passwordForm: {
                    newPassword: false,
                    newPasswordConfirm: false,
                    newPasswordComparision: false,
                    currentPassword: false
                },
                emailForm: {
                    email: false,
                    emailTaken: false,
                    password: false
                },
                unlimited: false,
                file: false
            },
            file: null,
            showSuccessAlert: false,
            showErrorAlert: false,
            alertMessage: ''
        };
    },
    methods: {
        validateNewPassword() {
            this.errors.passwordForm.newPassword = false;
            this.errors.passwordForm.newPasswordConfirm = false;
            this.errors.passwordForm.currentPassword = false;

            if (
                !this.passwordForm.newPassword ||
                this.passwordForm.newPassword.length < 8
            ) {
                this.errors.passwordForm.newPassword = true;
            }
            if (!this.passwordForm.newPasswordConfirm) {
                this.errors.passwordForm.newPasswordConfirm = true;
            }
            if (
                this.passwordForm.newPasswordConfirm !==
                this.passwordForm.newPassword
            ) {
                this.errors.passwordForm.newPasswordComparision = true;
            } else {
                this.errors.passwordForm.newPasswordComparision = false;
            }
            if (!this.passwordForm.currentPassword)
                this.errors.passwordForm.currentPassword = true;
        },
        async changePassword() {
            this.validateNewPassword();
            let isValid = true;
            const keys = Object.keys(this.errors.passwordForm);
            for (const key in keys) {
                if (this.errors.passwordForm[keys[key]]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                const jwt = localStorage.getItem('jwt');

                try {
                    const result = await axios.patch(
                        `${proxy}api/users/update-profile`,
                        {
                            whatsChanged: 'password',
                            password: this.passwordForm.currentPassword,
                            newPassword: this.passwordForm.newPassword,
                            newPasswordConfirm: this.passwordForm
                                .newPasswordConfirm
                        },
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    if (result.data.status === 'success') {
                        this.alertMessage = 'Hasło zmienione';
                        this.clearPasswordFormErrors();
                        this.clearPasswordForm();

                        this.showSuccessAlert = true;
                        setTimeout(() => {
                            this.showSuccessAlert = false;
                        }, 2000);
                    }
                } catch (err) {
                    this.alertMessage = 'Uwierzytelnianie nieudane';
                    this.showErrorAlert = true;
                    setTimeout(() => {
                        this.showErrorAlert = false;
                    }, 2000);
                }
            }
        },
        clearPasswordFormErrors() {
            Object.keys(this.errors.passwordForm).forEach(
                key => (this.errors.passwordForm[key] = false)
            );
        },
        clearPasswordForm() {
            Object.keys(this.passwordForm).forEach(
                key => (this.passwordForm[key] = '')
            );
        },
        validateEmail() {
            this.errors.emailForm.email = false;
            this.errors.emailForm.emailTaken = false;
            this.errors.emailForm.password = false;
            // eslint-disable-next-line no-useless-escape
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!this.emailForm.email || !regex.test(this.emailForm.email)) {
                this.errors.emailForm.email = true;
            }

            if (!this.emailForm.password) this.errors.emailForm.password = true;
        },
        async changeEmail() {
            this.validateEmail();
            let isValid = true;
            const keys = Object.keys(this.errors.emailForm);
            for (const key in keys) {
                if (this.errors.emailForm[keys[key]]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                const jwt = localStorage.getItem('jwt');

                try {
                    const result = await axios.patch(
                        `${proxy}api/users/update-profile`,
                        {
                            whatsChanged: 'email',
                            email: this.emailForm.email,
                            password: this.emailForm.password
                        },
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    if (result.data.status === 'success') {
                        this.clearEmailForm();
                        this.alertMessage = 'Email zmieniony';
                        this.showSuccessAlert = true;
                        setTimeout(() => {
                            this.showSuccessAlert = false;
                        }, 2000);
                    } else {
                        this.errors.emailForm.emailTaken = true;
                    }
                } catch (err) {
                    this.alertMessage = 'Uwierzytelnianie nieudane';
                    this.showErrorAlert = true;
                    setTimeout(() => {
                        this.showErrorAlert = false;
                    }, 2000);
                }
            }
        },
        clearEmailForm() {
            this.emailForm.password = '';
        },
        validateUnlimited() {
            this.errors.unlimited = false;
            if (!this.unlimitedForm.unlimited) {
                this.errors.unlimited = true;
            }
            return this.errors.unlimited;
        },
        async changeUnlimited() {
            if (!this.validateUnlimited()) {
                const jwt = localStorage.getItem('jwt');

                try {
                    await axios.patch(
                        `${proxy}api/users/update-profile`,
                        {
                            whatsChanged: 'unlimited',
                            unlimited: this.unlimitedForm.unlimited,
                            discount: this.unlimitedForm.discount
                        },
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    this.user.unlimited = new Date(
                        this.unlimitedForm.unlimited
                    );

                    this.alertMessage = 'Dane o abonencie zmienione';
                    this.showSuccessAlert = true;
                    setTimeout(() => {
                        this.showSuccessAlert = false;
                    }, 2000);
                } catch (err) {
                    this.alertMessage = 'Uwierzytelnianie nieudane';
                    this.showErrorAlert = true;
                    setTimeout(() => {
                        this.showErrorAlert = false;
                    }, 2000);
                }
            }
        },
        onFileSelected(event) {
            this.errors.file = false;
            this.file = event.target.files[0];
        },
        async changeUserPhoto() {
            if (this.file) {
                const fd = new FormData();
                fd.append('photo', this.file, this.file.name);
                try {
                    const jwt = localStorage.getItem('jwt');
                    const result = await axios.patch(
                        `${proxy}api/users/update-photo`,
                        fd,
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    this.alertMessage = 'Zdjecie zmienione';
                    this.showSuccessAlert = true;
                    setTimeout(() => {
                        this.showSuccessAlert = false;
                    }, 2000);

                    document.getElementById('fileInput').value = null;
                    this.file = null;
                    this.$emit('photoChanged', result.data.photo);
                } catch (err) {
                    this.errors.file = true;
                }
            }
        }
    },
    components: {
        Datepicker,
        AppAlert: Alert
    }
};
</script>
