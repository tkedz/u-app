<template>
    <div class="root" v-if="isDataFetched">
        <app-navbar></app-navbar>
        <main>
            <transition name="slide" mode="out-in">
                <keep-alive include="search">
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </main>
    </div>
</template>

<script>
import { getters, actions } from './store';
import Navbar from './components/Navbar';
export default {
    name: 'App',
    data() {
        return {
            isDataFetched: false
        };
    },
    computed: {
        ...getters
    },
    methods: {
        ...actions
    },
    async created() {
        console.log('fetch user');
        await this.fetchLoggedUser();
        this.isDataFetched = true;
    },
    components: {
        appNavbar: Navbar
    }
};
</script>

<style scoped>
.slide-enter-active {
    animation: slide-in 200ms ease-in-out forwards;
}

.slide-leave-active {
    animation: slide-out 200ms ease-in-out forwards;
}

@keyframes slide-in {
    from {
        transform: translateY(-30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-out {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-30px);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .root {
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        overflow: scroll;
    }

    main {
        margin: 0;
        height: 90vh;
    }
}

@media (min-width: 769px) {
    .root {
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
    }

    main {
        margin-left: 5rem;
        height: 100vh;
    }
}
</style>
