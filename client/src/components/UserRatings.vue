<template>
    <div class="container">
        <form class="mb-2">
            <div class="form-row align-items-center">
                <div class="col-auto">
                    <select class="form-control" v-model="sortQuery" @change="getRatings">
                        <option value="sort=date&order=-1">sortuj: od najnowszej</option>
                        <option value="sort=date&order=1">sortuj: od najstarszej</option>
                        <option value="sort=rating&order=1">sortuj: oceny rosnąco</option>
                        <option value="sort=rating&order=-1">sortuj: oceny malejąco</option>
                    </select>
                </div>
                <div class="col-auto">
                    <datepicker
                        :clear-button="true"
                        placeholder="od"
                        v-model="from"
                        :bootstrap-styling="true"
                        @input="getRatings"
                    ></datepicker>
                </div>
                <div class="col-auto">
                    <datepicker
                        :clear-button="true"
                        placeholder="do"
                        v-model="to"
                        :bootstrap-styling="true"
                        @input="getRatings"
                    ></datepicker>
                </div>
            </div>
        </form>

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
        <div
            class="alert alert-danger"
            v-if="isComponentCreated && ratings.length === 0"
        >{{user.username}} nie ocenił jeszcze żadnego filmu</div>
    </div>
</template>

<script>
import axios from 'axios';
import UserRating from './UserRating';
import Datepicker from 'vuejs-datepicker';
import { proxy } from '../config';
export default {
    props: ['user', 'myProfile'],
    data() {
        return {
            ratings: [],
            sortQuery: 'sort=date&order=-1',
            from: null,
            to: null,
            isComponentCreated: false
        };
    },
    computed: {
        fromDate() {
            if (this.from) return new Date(this.from).getTime();
            return new Date(0).getTime();
        },
        toDate() {
            if (this.to) return new Date(this.to).getTime();
            return new Date().getTime();
        }
    },
    methods: {
        async getRatings() {
            try {
                //console.log(this.user);
                const result = await axios.get(
                    // `http://localhost:3000/api/users/${this.user.id}/ratings?${this.sortQuery}&from=${this.fromDate}&to=${this.toDate}`
                    `${proxy}api/users/${this.user.id}/ratings?${this.sortQuery}&from=${this.fromDate}&to=${this.toDate}`
                );
                this.ratings = result.data.ratings;
                //console.log(this.ratings);
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
        this.isComponentCreated = true;
    },
    beforeRouteUpdate(to, from, next) {
        this.getRatings();
        next();
    },
    components: {
        UserRating,
        Datepicker
    }
};
</script>

<style scoped>
</style>