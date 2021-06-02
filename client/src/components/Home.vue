<template>
    <div class="h-100 position-relative">
        <header class="photo position-relative" :style="{ backgroundImage: `url(${require('@/assets/header-photo.jpg')})` }">
            <div class="container h-100 text-center">
                <span class="d-inline-block p-5 text-warning font-weight-bold heading">U-APP</span>
            </div>
            <div class="credits position-absolute">Photo by Felix Mooneeram on Unsplash</div>
        </header>

        <section class="py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 text-center p-3">
                        <span>🎬</span>
                        <p>Śledź i zapisuj swoje seanse kinowe!</p>
                    </div>
                    <div class="col-md-4 text-center p-3">
                        <span>📊</span>
                        <p>Sprawdzaj swoje statystyki!</p>
                    </div>
                    <div class="col-md-4 text-center p-3">
                        <span>🆚</span>
                        <p>Przeglądaj profile innych użytkowników oraz porównuj statystyki!</p>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="!isLogged">
            <div class="container text-center p-5">
                <div class="row">
                    <div class="col">
                        <router-link
                            to="/register"
                            tag="div"
                            class="btn btn-primary btn-lg"
                        >Dołącz do nas!</router-link>
                    </div>
                </div>
            </div>
        </section>

        <footer class="position-absolute w-100 d-none d-md-block">
            <div class="container text-center">
                <div class="row">
                    <div class="col">© Tomasz Kędziora</div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import { getters } from '../store';
export default {
    computed: {
        ...getters
    }
};
</script>

<style scoped>
.photo {
    /*background-image: url('http://localhost:3000/img/header-photo.jpg');*/
    /*background-image: url('img/header-photo.jpg');*/
    min-height: 400px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.credits {
    right: 10px;
    bottom: 10px;
    font-size: 10px;
}

.heading {
    letter-spacing: 2px;
    font-size: 1.9rem;
}

span {
    font-size: 64px;
}

footer {
    bottom: 10px;
}
</style>
