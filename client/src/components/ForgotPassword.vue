<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">
                    Resetowanie hasła 🔑
                </h1>
                <h1 class="d-block d-md-none display-6">
                    Resetowanie hasła 🔑
                </h1>
                <p class="lead">
                    Podaj swój email, a wyślemy Ci link do zresetowania hasła
                </p>
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
                            <div v-if="error" class="invalid-feedback">
                                Podaj email
                            </div>
                        </div>
                        <button
                            class="btn btn-primary"
                            @click.prevent="forgotPassword"
                        >
                            Wyślij
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            email: '',
            error: false
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
            } catch (err) {
                console.log('Error');
            }

            alert('Jeśli użytkownik istnieje, email został wysłany');
        }
    }
};
</script>

<style scoped></style>
