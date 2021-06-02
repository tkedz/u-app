<template>
    <router-link :to="`/users/${user.username}`" tag="div" class="card mx-3 mt-2">
        <div class="card-header">
            <img
                :src="`${prx}img/${user.photo}`"
                class="rounded-circle"
                width="150px"
                height="150px"
            />
            <!-- <img
                :src="`img/${user.photo}`"
                class="rounded-circle"
                width="150px"
                height="150px"
            /> -->
            <h5 class="card-title mt-2 text-white">{{user.username}}</h5>
        </div>
    </router-link>
</template>

<script>
import { proxy } from '../config'
export default {
    data() {
        return {
            prx: proxy
        }
    },
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