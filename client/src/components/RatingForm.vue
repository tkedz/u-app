<template>
    <form v-if="isDataFetched">
        <div class="form-group">
            <star-rating
                v-model="rating"
                :max-rating="10"
                :star-size="70"
                active-color="#ffc107"
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
        <div class="form-group">
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
        <div class="form-group">
            <label>Data obejrzenia</label>
            <datepicker v-model="date"></datepicker>
        </div>
        <button class="btn btn-primary" @click.prevent="postRating">
            Zapisz
        </button>
        <button
            class="btn btn-danger"
            @click.prevent="deleteRating"
            v-if="isRated"
        >
            Usuń
        </button>
    </form>
</template>

<script>
import axios from 'axios';
import StarRating from 'vue-star-rating';
import Datepicker from 'vuejs-datepicker';
export default {
    data() {
        return {
            rating: 0,
            review: '',
            screen: '2d',
            date: new Date(),
            isRated: false,
            isDataFetched: false
        };
    },
    props: ['movie', 'userId'],
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
                    `http://localhost:3000/api/ratings`,
                    {
                        rating: this.rating,
                        review: this.review,
                        screen: this.screen,
                        date: this.date ? this.date : new Date(),
                        movieId: this.movie.imdbID,
                        movieTitle: this.movie.Title,
                        moviePoster: this.movie.Poster
                    },
                    {
                        headers: { Authorization: `Bearer ${jwt}` }
                    }
                );

                this.isRated = true;
            } catch (err) {
                console.log(err);
                alert('Coś poszło nie tak, spróbuj ponownie później');
            }
        },
        async getRating() {
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/users/${this.userId}/ratings/${this.movie.imdbID}`
                );

                const { rating } = result.data;
                this.rating = rating.rating;
                this.review = rating.review;
                this.screen = rating.screen;
                this.date = rating.date;
                this.isRated = true;
                this.isDataFetched = true;
            } catch (err) {
                //user didnt rate the movie yet
                this.clearForm();
            }
        },
        async deleteRating() {
            const jwt = localStorage.getItem('jwt');
            await axios.delete(
                `http://localhost:3000/api/ratings/${this.movie.imdbID}`,
                {
                    headers: { Authorization: `Bearer ${jwt}` }
                }
            );
            this.clearForm();
        }
    },
    async created() {
        await this.getRating();
    },
    components: {
        StarRating,
        Datepicker
    }
};
</script>
