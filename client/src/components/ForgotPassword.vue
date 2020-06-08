<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Resetowanie hasła 🔑</h1>
                <h1 class="d-block d-md-none display-6">Resetowanie hasła 🔑</h1>
                <p class="lead">Podaj swój email, a wyślemy Ci link do zresetowania hasła</p>
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
                                :class="{ 'is-invalid': error }"
                                v-model="email"
                            />
                            <div v-if="error" class="invalid-feedback">Podaj email</div>
                        </div>
                        <button class="btn btn-primary" @click.prevent="forgotPassword">Wyślij</button>
                    </form>
                </div>
            </div>
        </div>
        <app-alert
            :success="true"
            v-if="showSuccessAlert"
        >Jeśli użytkownik istnieje, email został wysłany.</app-alert>
        <app-alert :success="false" v-if="showErrorAlert">Coś poszło nie tak</app-alert>
    </div>
</template>

<script>
import Alert from './Alert';
import axios from 'axios';
export default {
    data() {
        return {
            email: '',
            error: false,
            showSuccessAlert: false,
            showErrorAlert: false
        };
    },
    methods: {
        async forgotPassword() {
            this.error = false;

            if (this.email === '') return (this.error = true);

            try {
                await axios.post(
                    `http://localhost:3000/api/users/forgot-password`,
                    { email: this.email }
                );

                this.showSuccessAlert = true;
                setTimeout(() => {
                    this.showSuccessAlert = false;
                }, 2000);
            } catch (err) {
                this.showErrorAlert = true;
                setTimeout(() => {
                    this.showErrorAlert = false;
                }, 2000);
            }
        }
    },
    components: {
        appAlert: Alert
    }
};
</script>

<style scoped></style>
