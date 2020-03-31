<template>
    <div class="card">
        <img
            class="card-img-top"
            src="https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg"
        />
        <div class="card-body">
            <p class="card-title">Blade Runner 2049</p>
            <p class="card-subtitle mb-2 text-muted">2017</p>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.card {
    width: 220px;
    border-radius: 10px;
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
    border-radius: 10px 10px 0px 0px;
}

@media (max-width: 767px) {
    .card-body .p {
        font-size: 12px;
    }
}

@media (max-width: 768px) {
    .card {
        width: 176px;
    }

    .card-img-top {
        width: inherit;
        height: 264px;
    }
}
</style>