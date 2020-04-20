<template>
    <div>
        <div
            class="alert alert-danger"
            v-if="error"
        >{{user.username}} nie ocenił jeszcze żadnego filmu</div>
        <div v-else>{{stats}}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            stats: [],
            error: false
        };
    },
    props: ['user'],
    async created() {
        try {
            const result = await axios.get(
                `http://localhost:3000/api/users/${this.user.id}/stats`
            );
            this.stats = result.data.stats;
            console.log(this.stats);
        } catch (err) {
            this.error = true;
        }
    }
};
</script>

<style scoped>
</style>