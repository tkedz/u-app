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
                            <input type="text" class="form-control" v-model="searchQuery" required />
                            <button class="btn btn-primary ml-2">Szukaj</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row row-cols-2 row-cols-sm-3 row-cols-xl-5">
                <div class="col my-2 d-flex justify-content-center" v-for="n in 10" :key="n">
                    <app-movie-card></app-movie-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MovieSearchCard from './MovieSearchCard';
export default {
    data() {
        return {
            searchQuery: ''
        };
    },
    computed: {
        validateSearchQuery() {
            if (this.searchQuery) return true;
            return false;
        }
    },
    methods: {
        search() {}
    },
    components: {
        AppMovieCard: MovieSearchCard
    }
};
</script>

<style scoped>
</style>