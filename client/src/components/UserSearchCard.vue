<template>
    <router-link :to="`/users/${user.username}`" tag="div" class="card mx-3 mt-2">
        <div class="card-header">
            <img
                :src="`http://localhost:3000/img/${user.photo}`"
                class="rounded-circle"
                width="150px"
                height="150px"
            />
            <h5 class="card-title mt-2 text-white">{{user.username}}</h5>
        </div>
    </router-link>
</template>

<script>
export default {
    props: ['user']
};
</script>

<style scoped>
.card {
    cursor: pointer;
    transition: 0.4s;
}

.card:hover {
    transform: scale(0.9, 0.9);
}
</style>