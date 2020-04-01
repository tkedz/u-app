<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Znajdź swoje ulubione filmy 🎬</h1>
                <h1 class="d-block d-md-none display-6">Znajdź swoje ulubione filmy 🎬</h1>
                <div class="col-lg-6 offset-lg-3">
                    <form class="form inline mt-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">🔎</div>
                            </div>
                            <input
                                type="text"
                                class="form-control"
                                v-model="searchQuery.query"
                                required
                            />
                            <!-- <input type="text" v-model.number="searchQuery.year" />> -->
                            <button class="btn btn-primary ml-2" @click.prevent="search">Szukaj</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row row-cols-2 row-cols-sm-3 row-cols-xl-5">
                <div
                    class="col my-2 d-flex justify-content-center"
                    v-for="movie in searchResults"
                    :key="movie.imdbID"
                >
                    <app-movie-card :movie="movie"></app-movie-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MovieSearchCard from './MovieSearchCard';
import axios from 'axios';
export default {
    name: 'search',
    data() {
        return {
            searchQuery: {
                query: '',
                year: null
            },
            currentPage: 1,
            totalSearchResults: 0,
            searchResults: []
        };
    },
    computed: {
        validateSearchQuery() {
            if (this.searchQuery.query) return true;
            return false;
        }
    },
    methods: {
        async search() {
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/movies/search/${this.searchQuery.query}?year=${this.searchQuery.year}&page=1`
                );

                console.log(result);
                this.totalSearchResults = result.data.totalResults;
                this.searchResults = result.data.data;
            } catch (err) {
                this.totalSearchResults = 0;
                this.searchResults = [];
                alert('Nothing found');
            }
        }
    },
    components: {
        AppMovieCard: MovieSearchCard
    }
};
</script>

<style scoped>
</style>