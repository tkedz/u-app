<template>
    <router-link :to="`/movies/${movie.imdbID}`" tag="div" class="card">
        <img v-if="movie.Poster != 'N/A'" class="card-img-top" :src="movie.Poster" />
        <img v-else class="card-img-top" :src="`http://localhost:3000/img/noposter.jpg`" />
        <div class="card-body">
            <p class="card-title">{{movie.Title}}</p>
            <p class="card-subtitle mb-2 text-muted">{{movie.Year}}</p>
        </div>
    </router-link>
</template>

<script>
export default {
    props: ['movie']
};
</script>

<style scoped>
.card {
    width: 220px;
    border-radius: 10px;
    border: none;
    box-shadow: 5px 5px 30px 7px rgba(0, 0, 0, 0.25),
        -5px -5px 30px 7px rgba(0, 0, 0, 0.22);
    cursor: pointer;
    transition: 0.4s;
}

.card:hover {
    transform: scale(0.9, 0.9);
}

.card-img-top {
    width: inherit;
    height: 330px;
    border: none;
    border-radius: 10px 10px 0px 0px;
}

@media (max-width: 767px) {
    .card-body p {
        font-size: 12px;
    }

    .card {
        width: 176px;
    }

    .card-img-top {
        width: inherit;
        height: 264px;
    }
}
</style>