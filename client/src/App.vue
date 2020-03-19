<template>
    <div class="root">
        <app-navbar></app-navbar>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
import Navbar from './components/Navbar';
export default {
    name: 'App',
    components: {
        appNavbar: Navbar
    }
};
</script>

<style scoped>
@media (max-width: 576px) {
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

@media (min-width: 577px) {
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
