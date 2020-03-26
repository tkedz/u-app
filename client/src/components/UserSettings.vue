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
                            :class="{ 'is-invalid': errors.newPassword }"
                            v-model="form.newPassword"
                            @keyup="validateNewPassword"
                        />
                        <div
                            v-if="errors.newPassword"
                            class="invalid-feedback"
                        >Hasło musi mieć minimum 8 znaków</div>
                        <div
                            v-if="errors.newPasswordComparision"
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
                                        errors.newPasswordConfirm ||
                                        errors.newPasswordComparision
                                    }"
                            v-model="form.newPasswordConfirm"
                            @keyup="validateNewPassword"
                        />
                        <div v-if="errors.newPasswordConfirm" class="invalid-feedback">Powtórz hasło</div>
                        <div
                            v-if="errors.newPasswordComparision"
                            class="invalid-feedback"
                        >Hasła się nie zgadzają</div>
                    </div>
                    <div class="form-group col-md-6">
                        <label>Obecne hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            :class="{'is-invalid':errors.currentPassword}"
                            v-model="form.currentPassword"
                            @keyup="validateNewPassword"
                        />
                        <div
                            v-if="errors.currentPassword"
                            class="invalid-feedback"
                        >Podaj obecne hasło</div>
                    </div>
                    <button class="btn btn-primary" @click.prevent="changePassword">Zmień hasło</button>
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
            form: {
                newPassword: '',
                newPasswordConfirm: '',
                currentPassword: ''
            },
            errors: {
                newPassword: false,
                newPasswordConfirm: false,
                newPasswordComparision: false,
                currentPassword: false
            }
        };
    },
    methods: {
        validateNewPassword() {
            this.errors.newPassword = false;
            this.errors.newPasswordConfirm = false;
            this.errors.currentPassword = false;

            if (!this.form.newPassword || this.form.newPassword.length < 8) {
                this.errors.newPassword = true;
            }
            if (!this.form.newPasswordConfirm) {
                this.errors.newPasswordConfirm = true;
            }
            if (this.form.newPasswordConfirm !== this.form.newPassword) {
                this.errors.newPasswordComparision = true;
            } else {
                this.errors.newPasswordComparision = false;
            }
            if (!this.form.currentPassword) this.errors.currentPassword = true;
        },
        async changePassword() {
            this.validateNewPassword();
            let isValid = true;
            const keys = Object.keys(this.errors);
            console.log(keys);
            for (const key in keys) {
                if (this.errors[keys[key]]) {
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
                            password: this.form.currentPassword,
                            newPassword: this.form.newPassword,
                            newPasswordConfirm: this.form.newPasswordConfirm
                        },
                        {
                            headers: { Authorization: `Bearer ${jwt}` }
                        }
                    );

                    if (result.data.status === 'success') {
                        alert('Hasło zmienione');
                        this.clearForm();
                    }
                } catch (err) {
                    alert('Uwierzytelnianie nieudane');
                }
            }
        },
        clearForm() {
            Object.keys(this.form).forEach(key => (this.form[key] = ''));
            Object.keys(this.errors).forEach(key => (this.errors[key] = false));
        }
    }
};
</script>