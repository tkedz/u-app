<template>
    <div>
        <form v-if="isDataFetched" class="mb-3">
            <div class="form-group">
                <star-rating
                    v-model="rating"
                    :max-rating="10"
                    :star-size="40"
                    active-color="#ff8800"
                    :border-color="'#000'"
                    :glow="1"
                ></star-rating>
                <div v-if="error" class="text-danger mt-1">Ocena jest wymagana</div>
            </div>
            <div class="form-group">
                <textarea
                    type="text"
                    class="form-control"
                    placeholder="Twoja opinia"
                    v-model="review"
                />
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label>Sala</label>
                    <select class="form-control" v-model="screen">
                        <option value="2d">2D</option>
                        <option value="3d">3D</option>
                        <option value="imax2d">IMAX 2D</option>
                        <option value="imax3d">IMAX 3D</option>
                        <option value="4dx2d">4DX 2D</option>
                        <option value="4dx3d">4DX 3D</option>
                        <option value="vip2d">VIP 2D</option>
                        <option value="vip3d">VIP 3D</option>
                    </select>
                </div>
                <div class="form-group col-md-6">
                    <label>Data obejrzenia</label>
                    <datepicker v-model="date" :bootstrap-styling="true"></datepicker>
                </div>
                <button class="btn btn-primary py-3 px-4" @click.prevent="postRating">Zapisz</button>
                <button
                    class="btn btn-danger ml-2 py-3 px-4"
                    @click.prevent="deleteRating"
                    v-if="isRated"
                >Usuń</button>
            </div>
        </form>
        <app-alert :success="false" v-if="showAlert">Coś poszło nie tak</app-alert>
    </div>
</template>

<script>
import axios from 'axios';
import StarRating from 'vue-star-rating';
import Datepicker from 'vuejs-datepicker';
import Alert from './Alert';
import { proxy } from '../config';
export default {
    data() {
        return {
            rating: 0,
            review: '',
            screen: '2d',
            date: new Date(),
            isRated: false,
            isDataFetched: false,
            showAlert: false
        };
    },
    props: ['movie', 'userId', 'discount'],
    computed: {
        error() {
            if (this.rating >= 1 && this.rating <= 10) return false;

            return true;
        }
    },
    methods: {
        clearForm() {
            this.rating = 0;
            this.review = '';
            this.screen = '2d';
            this.date = new Date();
            this.isRated = false;
        },
        async postRating() {
            if (this.error) return;

            const jwt = localStorage.getItem('jwt');
            try {
                await axios.post(
                    `${proxy}api/ratings`,
                    {
                        rating: this.rating,
                        review: this.review,
                        screen: this.screen,
                        date: this.date ? this.date : new Date(),
                        preRelease: this.date <= new Date(this.movie.Released),
                        movieId: this.movie.imdbID,
                        movieTitle: this.movie.Title,
                        movieReleased: this.movie.Released,
                        movieDirector: this.movie.Director,
                        moviePoster: this.movie.Poster,
                        movieRuntime:
                            typeof this.movie.Runtime === 'string'
                                ? parseInt(this.movie.Runtime.split(' ')[0], 10)
                                : this.movie.Runtime,
                        movieGenre:
                            typeof this.movie.Genre === 'string'
                                ? this.movie.Genre.split(', ')
                                : this.movie.Genre,
                        movieCountry:
                            typeof this.movie.Country === 'string'
                                ? this.movie.Country.split(', ')
                                : this.movie.Country,
                        discount: this.discount
                    },
                    {
                        headers: { Authorization: `Bearer ${jwt}` }
                    }
                );

                this.isRated = true;

                //emit event in user profile to update ratings array
                this.$emit('updated', {
                    rating: this.rating,
                    review: this.review,
                    date: this.date
                });
            } catch (err) {
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 2000);
            }
        },
        async getRating() {
            try {
                const result = await axios.get(
                    `${proxy}api/users/${this.userId}/ratings/${this.movie.imdbID}`
                );

                const { rating } = result.data;
                this.rating = rating.rating;
                this.review = rating.review;
                this.screen = rating.screen;
                this.date = rating.date;
                this.isRated = true;
            } catch (err) {
                //user didnt rate the movie yet
                this.clearForm();
            }
            this.isDataFetched = true;
        },
        async deleteRating() {
            const jwt = localStorage.getItem('jwt');
            await axios.delete(
                `${proxy}api/ratings/${this.movie.imdbID}`,
                {
                    headers: { Authorization: `Bearer ${jwt}` }
                }
            );
            this.clearForm();

            //emit event in user profile to update ratings array
            this.$emit('deleted');
        }
    },
    async created() {
        await this.getRating();
    },
    components: {
        StarRating,
        Datepicker,
        appAlert: Alert
    }
};
</script>
