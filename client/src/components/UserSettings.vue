<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <form>
                    <div class="form-group col-md-6">
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
                        >
                            Hasło musi mieć minimum 8 znaków
                        </div>
                        <div
                            v-if="errors.passwordForm.newPasswordComparision"
                            class="invalid-feedback"
                        >
                            Hasła się nie zgadzają
                        </div>
                    </div>
                    <div class="form-group col-md-6">
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
                        >
                            Powtórz hasło
                        </div>
                        <div
                            v-if="errors.passwordForm.newPasswordComparision"
                            class="invalid-feedback"
                        >
                            Hasła się nie zgadzają
                        </div>
                    </div>
                    <div class="form-group col-md-6">
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
                        >
                            Podaj obecne hasło
                        </div>
                    </div>
                    <button
                        class="btn btn-primary"
                        @click.prevent="changePassword"
                    >
                        Zmień hasło
                    </button>
                </form>
                <hr />
                <form>
                    <div class="form-group col-12">
                        <label>Email</label>
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
                        >
                            Email nieprawidłowy
                        </div>
                        <div
                            v-if="errors.emailForm.emailTaken"
                            class="invalid-feedback"
                        >
                            Podany email jest zajęty
                        </div>
                    </div>
                    <div class="form-group col-12">
                        <label>Hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{ 'is-invalid': errors.emailForm.password }"
                            v-model="emailForm.password"
                            @keyup="validateEmail"
                        />
                        <div
                            v-if="errors.emailForm.password"
                            class="invalid-feedback"
                        >
                            Podaj hasło
                        </div>
                    </div>
                    <button
                        class="btn btn-primary"
                        @click.prevent="changeEmail"
                    >
                        Zmień email
                    </button>
                </form>
                <hr />
                <form>
                    <div class="form-group">
                        <input
                            id="fileInput"
                            class="form-control"
                            :class="{ 'is-invalid': errors.file }"
                            type="file"
                            @change="onFileSelected"
                            accept="image/*"
                        />
                        <div class="invalid-feedback" v-if="errors.file">
                            Wybierz zdjęcie
                        </div>
                    </div>
                    <button
                        class="btn btn-primary"
                        @click.prevent="changeUserPhoto"
                    >
                        Zmień zdjęcie
                    </button>
                </form>
                <form>
                    <div class="form-group">
                        <label
                            >Abonent od
                            {{ user.unlimited.toLocaleDateString() }}</label
                        >
                        <input
                            type="date"
                            class="form-control"
                            :class="{ 'is-invalid': errors.unlimited }"
                            v-model="unlimitedForm.unlimited"
                            @click="errors.unlimited = false"
                        />
                        <div v-if="errors.unlimited" class="invalid-feedback">
                            Podaj datę dołączenia do abonamentu
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Zniżka</label>
                        <select
                            class="form-control"
                            v-model="unlimitedForm.discount"
                        >
                            <option value="regular">brak</option>
                            <option value="student"
                                >studencka / uczniowska</option
                            >
                            <option value="senior">seniora</option>
                            <option value="veteran">weterana</option>
                        </select>
                    </div>
                    <button
                        class="btn btn-primary btn-block"
                        @click.prevent="changeUnlimited"
                    >
                        Zmień
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
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
                unlimited: null,
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
            file: null
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
                        `http://localhost:3000/api/users/update-profile`,
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
                        alert('Hasło zmienione');
                        this.clearPasswordFormErrors();
                        this.clearPasswordForm();
                    }
                } catch (err) {
                    alert('Uwierzytelnianie nieudane');
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
                        `http://localhost:3000/api/users/update-profile`,
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
                        alert('Email zmieniony');
                    } else {
                        this.errors.emailForm.emailTaken = true;
                    }
                } catch (err) {
                    alert('Uwierzytelnianie nieudane');
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
                        `http://localhost:3000/api/users/update-profile`,
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
                    alert('Dane o abonamencie zmienione');
                } catch (err) {
                    alert('Uwierzytelnianie nieudane');
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
                        `http://localhost:3000/api/users/update-photo`,
                        fd,
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    alert('Zdjecie zmienione');
                    document.getElementById('fileInput').value = null;
                    this.file = null;
                    this.$emit('photoChanged', result.data.photo);
                } catch (err) {
                    this.errors.file = true;
                }
            }
        }
    }
};
</script>
