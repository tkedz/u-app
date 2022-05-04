<template>
    <div class="container p-2">
        <div class="row mb-4">
            <div class="col-md-4 text-center">
                <img
                    v-if="movie.Poster !== 'N/A'"
                    :src="movie.Poster"
                    class="poster float-md-right"
                />
                <img
                    v-else
                    :src="`${require('@/assets/noposter.jpg')}`"
                    class="poster float-md-right"
                />
            </div>
            <div class="col-md-8 d-flex flex-column">
                <h4 class="title">{{ movie.Title }}</h4>
                <h5 class="text-muted">reż. {{ movie.Director }}</h5>
                <p class="lead">{{ movie.Plot }}</p>
                <div class="d-flex">
                    <div class="p-2" v-if="movie.imdbRating !== 'N/A'">
                        <img src="@/assets/imdb.jpg" class="logo" />
                        <span
                            class="badge badge-success d-block mt-2 rating"
                            v-if="movie.imdbRating >= 6.5"
                        >{{ movie.imdbRating }}</span>
                        <span
                            class="badge badge-warning d-block mt-2 rating"
                            v-if="
                                    movie.imdbRating < 6.5 &&
                                        movie.imdbRating >= 5.0
                                "
                        >{{ movie.imdbRating }}</span>
                        <span
                            class="badge badge-danger d-block mt-2 rating"
                            v-if="movie.imdbRating < 5.0"
                        >{{ movie.imdbRating }}</span>
                    </div>
                    <div class="p-2" v-if="movie.RtRating !== 'N/A'">
                        <img src="@/assets/rotten.jpg" class="logo" />
                        <span
                            class="badge badge-success d-block mt-2 rating"
                            v-if="movie.RtRating >= 65"
                        >{{ movie.RtRating }}</span>
                        <span
                            class="badge badge-warning d-block mt-2 rating"
                            v-if="movie.RtRating < 65 && movie.RtRating >= 50"
                        >{{ movie.RtRating }}</span>
                        <span
                            class="badge badge-danger d-block mt-2 rating"
                            v-if="movie.RtRating < 50"
                        >{{ movie.RtRating }}</span>
                    </div>
                    <div class="p-2" v-if="movie.Metascore !== 'N/A'">
                        <img src="@/assets/metacritic.png" class="logo" />
                        <span
                            class="badge badge-success d-block mt-2 rating"
                            v-if="movie.Metascore >= 65"
                        >{{ movie.Metascore }}</span>
                        <span
                            class="badge badge-warning d-block mt-2 rating"
                            v-if="movie.Metascore < 65 && movie.Metascore >= 50"
                        >{{ movie.Metascore }}</span>
                        <span
                            class="badge badge-danger d-block mt-2 rating"
                            v-if="movie.Metascore < 50"
                        >{{ movie.Metascore }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- PILLS -->
        <ul class="nav nav-tabs mt-2">
            <li class="nav-item">
                <a
                    class="nav-link"
                    @click="toggle('details')"
                    :class="{ active: active.details }"
                >Szczegóły</a>
            </li>
            <li class="nav-item">
                <a
                    class="nav-link"
                    @click="toggle('cast')"
                    :class="{ active: active.cast }"
                >Obsada / Twórcy</a>
            </li>
            <li class="nav-item" v-if="isLogged">
                <a
                    class="nav-link"
                    @click="toggle('myRating')"
                    :class="{ active: active.myRating }"
                >Mój seans</a>
            </li>
        </ul>

        <div id="details" class="d-flex flex-wrap mt-2" v-if="active.details">
            <div class="px-3">
                <h5>Data premiery📆</h5>
                <p class="lead">{{ new Date(movie.Released).toLocaleDateString() }}</p>
            </div>
            <div class="px-3">
                <h5>Czas trwania⏳</h5>
                <p class="lead">{{ movie.Runtime }}</p>
            </div>
            <div class="px-3">
                <h5>Gatunek🎥</h5>
                <p class="lead">{{ movie.Genre }}</p>
            </div>
            <div class="px-3">
                <h5>Kategoria wiekowa❌</h5>
                <p class="lead">{{ movie.Rated }}</p>
            </div>
            <div class="px-3">
                <h5>Język💬</h5>
                <p class="lead">{{ movie.Language }}</p>
            </div>
            <div class="px-3">
                <h5>Kraj🌎</h5>
                <p class="lead">{{ movie.Country }}</p>
            </div>
            <div class="px-3">
                <h5>Nagrody🏆</h5>
                <p class="lead">{{ movie.Awards }}</p>
            </div>
        </div>

        <div id="cast" class="d-flex flex-column mt-2" v-if="active.cast">
            <div class="px-3">
                <h5>Reżyseria🎬</h5>
                <p class="lead">{{ movie.Director }}</p>
            </div>
            <div class="px-3">
                <h5>Scenariusz📝</h5>
                <p class="lead">{{ movie.Writer }}</p>
            </div>
            <div class="px-3">
                <h5>Aktorzy🎭</h5>
                <p class="lead">{{ movie.Actors }}</p>
            </div>
            <div class="px-3">
                <h5>Produkcja🌆</h5>
                <p class="lead">{{ movie.Production }}</p>
            </div>
        </div>

        <div id="myRating" class="mt-2" v-if="isLogged && active.myRating">
            <rating-form :movie="movie" :userId="user.id" :discount="user.discount"></rating-form>
        </div>

        <app-alert :success="false" v-if="showAlert">Nie znaleziono filmu</app-alert>
    </div>
</template>

<script>
import axios from 'axios';
import { getters } from '../store';
import RatingForm from '../components/RatingForm';
import Alert from './Alert';
import { proxy } from '../config';

export default {
    data() {
        return {
            movie: {},
            active: {
                details: true,
                cast: false,
                myRating: false,
            },
            showAlert: false,
        };
    },
    computed: {
        ...getters,
    },
    methods: {
        toggle(what) {
            Object.keys(this.active).forEach((key) => {
                this.active[key] = false;
            });
            this.active[what] = true;
        },
        async getMovieDetails() {
            try {
                const result = await axios.get(
                    `${proxy}api/movies/${this.$route.params.id}`
                );

                this.movie = result.data.data;
            } catch (err) {
                this.$router.push('/404');
            }
        },
    },
    async created() {
        await this.getMovieDetails();
    },
    components: {
        RatingForm,
        appAlert: Alert,
    },
};
</script>

<style scoped>
.poster {
    width: 220px;
    height: 330px;
    border-radius: 10px;
}

.title {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    letter-spacing: 2px;
}

.logo {
    border-radius: 500px;
    width: 60px;
    height: 60px;
}

.rating {
    font-size: 1rem;
}

@media (max-width: 767px) {
    p {
        font-size: 0.9rem;
    }

    .poster {
        width: 176px;
        height: 264px;
    }
}

@media (min-width: 768px) {
    p {
        font-size: 1rem;
    }
}
</style>
