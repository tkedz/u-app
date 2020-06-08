<template>
    <div>
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center">
                <h1 class="d-none d-md-block display-4">Szukaj 🔍</h1>
                <h4 class="d-block d-md-none">Szukaj 🔍</h4>
                <div class="col-lg-10 offset-lg-1">
                    <form class="form inline mt-3">
                        <div class="input-group">
                            <select class="form-control col-2 mr-2" v-model="whatToSearch">
                                <option value="users">Użytkownicy</option>
                                <option value="movies">Filmy</option>
                            </select>
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
                                v-if="whatToSearch === 'movies'"
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
        <!-- MOVIES -->
        <div v-if="displayMovies">
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
        <!-- USERS -->
        <div v-else>
            <div class="container-fluid">
                <div class="d-flex flex-wrap">
                    <div v-for="user in searchResults" :key="user._id" class="d-flex">
                        <app-user-card :user="user"></app-user-card>
                    </div>
                </div>
            </div>
        </div>
        <app-alert v-if="showAlert" :success="false">Nic nie znaleziono</app-alert>
    </div>
</template>

<script>
/* eslint-disable no-empty */
import MovieSearchCard from './MovieSearchCard';
import UserSeachCard from './UserSearchCard';
import Alert from './Alert';
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
            searchResults: [],
            whatToSearch: 'movies',
            displayMovies: true,
            showAlert: false
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
            //console.log('search');
            if (this.whatToSearch === 'movies') {
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

                    this.displayMovies = true;
                } catch (err) {
                    this.totalSearchResults = 0;
                    this.searchResults = [];
                    //alert('Nothing found');
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 2000);
                    this.$router.push({ path: 'search' });
                }
            } else {
                try {
                    const result = await axios.get(
                        `http://localhost:3000/api/users/search/${this.searchQuery.query}`
                    );
                    this.searchResults = result.data.users;
                    this.totalSearchResults = this.searchResults.length;
                    this.displayMovies = false;
                    this.$router.push({
                        path: 'search'
                    });
                } catch (err) {
                    this.totalSearchResults = 0;
                    this.searchResults = [];
                    //alert('Nothing found');
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 2000);
                    this.$router.push({ path: 'search' });
                }
            }
        }
    },
    components: {
        AppMovieCard: MovieSearchCard,
        AppUserCard: UserSeachCard,
        AppAlert: Alert
    },
    async created() {
        //console.log('created search component');
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