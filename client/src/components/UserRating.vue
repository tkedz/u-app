<template>
    <div>
        <div class="d-flex">
            <router-link
                :to="`/movies/${rating.movieId}`"
                tag="img"
                :src="rating.moviePoster"
                class="poster"
            ></router-link>
            <div class="flex-grow-1 px-3 position-relative">
                <router-link
                    :to="`/movies/${rating.movieId}`"
                    tag="h4"
                    class="title border-bottom border-warning"
                >{{rating.movieTitle}}</router-link>
                <p class="lead">{{rating.review}}</p>
                <div class="stars">
                    <span v-for="n in rating.rating" :key="n">
                        <ion-icon name="star"></ion-icon>
                    </span>
                    <span class="p-2 star-number text-warning">{{rating.rating}}</span>
                </div>
                <div class="rating-date">{{rating.date.toLocaleDateString()}}</div>
            </div>
        </div>
        <button
            class="btn btn-primary btn-block mt-2 mb-3"
            @click="toggle"
            v-if="isLogged && myProfile"
        >{{edit ? 'Zwiń' : 'Edytuj'}}</button>
        <rating-form
            v-if="edit"
            :movie="movie"
            :userId="user.id"
            @deleted="$emit('deleted', index)"
            @updated="ratingUpdated"
        ></rating-form>
    </div>
</template>

<script>
import RatingForm from './RatingForm';
import { getters } from '../store';
export default {
    props: ['rating', 'index', 'myProfile'],
    data() {
        return {
            edit: false
        };
    },
    computed: {
        ...getters,
        movie() {
            return {
                imdbID: this.rating.movieId,
                Title: this.rating.movieTitle,
                Director: this.rating.movieDirector,
                Poster: this.rating.moviePoster,
                Genre: this.rating.movieGenre,
                Runtime: this.rating.Runtime,
                Country: this.rating.movieCountry,
                Released: this.rating.movieReleased
            };
        }
    },
    methods: {
        toggle() {
            this.edit = !this.edit;
        },
        ratingUpdated(rating) {
            this.toggle();
            this.$emit('updated', rating, this.index);
        }
    },
    created() {
        //create Date obj from rating.date
        this.rating.date = new Date(this.rating.date);
    },
    beforeUpdate() {
        this.rating.date = new Date(this.rating.date);
    },
    components: {
        RatingForm
    }
};
</script>

<style scoped>
.poster {
    width: 220px;
    height: 330px;
    border-radius: 10px;
}

.poster:hover {
    cursor: pointer;
}

.title {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    letter-spacing: 2px;
}

.title:hover {
    cursor: pointer;
    color: #ff8800;
    transition: color 0.2s;
}

.stars {
    position: absolute;
    bottom: 10px;
    font-size: 32px;
}

.rating-date {
    position: absolute;
    bottom: 10px;
    right: 5px;
}

ion-icon {
    color: #ff8800;
}
@media (max-width: 767px) {
    .poster {
        width: 176px;
        height: 264px;
    }

    .title {
        font-size: 1.2rem;
    }

    .lead {
        font-size: 1rem;
    }

    .stars {
        font-size: 16px;
    }
}
</style>