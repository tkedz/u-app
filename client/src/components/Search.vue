<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Znajdź swoje ulubione filmy 🎬</h1>
                <h1 class="d-block d-md-none display-6">Znajdź swoje ulubione filmy 🎬</h1>
                <div class="col-lg-8 offset-lg-2">
                    <form class="form inline mt-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">🔎</div>
                            </div>
                            <input
                                type="text"
                                class="form-control mr-2"
                                v-model="searchQuery.query"
                                required
                            />
                            <input
                                type="number"
                                class="form-control col-2"
                                v-model="searchQuery.year"
                                placeholder="rok"
                            />
                            <button
                                class="btn btn-primary ml-2"
                                @click.prevent="currentPage=1; search()"
                            >Szukaj</button>
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
        <nav class="mt-2" v-if="pagesCount > 1">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: currentPage === 1 ? true : false}">
                    <a class="page-link" @click="currentPage--">Poprzednia</a>
                </li>
                <li class="page-item">
                    <a class="page-link">Strona {{currentPage}}/{{pagesCount}}</a>
                </li>
                <li
                    class="page-item"
                    :class="{disabled: currentPage === pagesCount ? true : false}"
                >
                    <a class="page-link" @click="currentPage++">Następna</a>
                </li>
            </ul>
        </nav>
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
                year: ''
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
        },
        pagesCount() {
            let count = parseInt(this.totalSearchResults / 10, 10);
            if (this.totalSearchResults % 10 !== 0) count++;
            return count;
        }
    },
    watch: {
        currentPage(page) {
            this.$router.push({
                path: 'search',
                query: {
                    title: this.searchQuery.query,
                    year: this.searchQuery.year,
                    page
                }
            });
            this.search();
        }
    },
    methods: {
        async search() {
            console.log('search');
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/movies/search/${this.searchQuery.query}?year=${this.searchQuery.year}&page=${this.currentPage}`
                );
                this.totalSearchResults = result.data.totalResults;
                this.searchResults = result.data.data;

                //modify url to share a link
                this.$router.push({
                    path: 'search',
                    query: {
                        title: this.searchQuery.query,
                        year: this.searchQuery.year,
                        page: this.currentPage
                    }
                });
            } catch (err) {
                this.totalSearchResults = 0;
                this.searchResults = [];
                alert('Nothing found');
                this.$router.push({ path: 'search' });
            }
        }
    },
    components: {
        AppMovieCard: MovieSearchCard
    },
    async created() {
        console.log('created search component');
        let executeQuery = false;

        if (this.$route.query.title) {
            executeQuery = true;
            this.searchQuery.query = this.$route.query.title;
        }

        if (this.$route.query.year) {
            executeQuery = true;
            this.searchQuery.year = this.$route.query.year;
        }

        if (executeQuery && this.$route.query.page) {
            this.currentPage = this.$route.query.page;
        }

        if (executeQuery) await this.search();
    }
};
</script>

<style scoped>
</style>