<template>
    <div class="container">
        <div v-if="ratings.length !== 0">
            <user-rating
                v-for="(rating, index) in ratings"
                :key="rating.movieId"
                :rating="rating"
                :index="index"
                :myProfile="myProfile"
                @deleted="ratingDeleted"
                @updated="ratingUpdated"
            ></user-rating>
        </div>
        <div class="alert alert-danger" v-else>{{user.username}} nie ocenił jeszcze żadnego filmu</div>
    </div>
</template>

<script>
import axios from 'axios';
import UserRating from './UserRating';
export default {
    props: ['user', 'myProfile'],
    data() {
        return {
            ratings: []
        };
    },
    methods: {
        async getRatings() {
            try {
                console.log(this.user);
                const result = await axios.get(
                    `http://localhost:3000/api/users/${this.user.id}/ratings`
                );
                this.ratings = result.data.ratings;
                console.log(this.ratings);
            } catch (err) {
                this.ratings = [];
            }
        },
        ratingDeleted(index) {
            this.ratings.splice(index, 1);
        },
        ratingUpdated(rating, index) {
            this.ratings[index].rating = rating.rating;
            this.ratings[index].review = rating.review;
            this.ratings[index].date = rating.date;
        }
    },
    async created() {
        await this.getRatings();
    },
    beforeRouteUpdate(to, from, next) {
        this.getRatings();
        next();
    },
    components: {
        UserRating
    }
};
</script>

<style scoped>
</style>