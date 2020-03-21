<template>
    <nav class="navbar-custom bg-warning">
        <ul class="navbar-nav-custom">
            <li class="logo">
                <router-link to="/" tag="a" class="nav-link-custom">
                    <span>
                        <ion-icon name="heart"></ion-icon>
                    </span>
                    <span class="link-text">UNLIMITED</span>
                </router-link>
            </li>
            <li class="nav-item-custom">
                <router-link to="/" tag="a" class="nav-link-custom">
                    <span>
                        <ion-icon name="home-sharp"></ion-icon>
                    </span>
                    <span class="link-text">Home</span>
                </router-link>
            </li>
            <li class="nav-item-custom">
                <router-link to="/login" tag="a" class="nav-link-custom">
                    <span>
                        <ion-icon name="home-sharp"></ion-icon>
                    </span>
                    <span class="link-text">test</span>
                </router-link>
            </li>
            <li class="nav-item-custom">
                <router-link to="/" tag="a" class="nav-link-custom">
                    <span>
                        <ion-icon name="home-sharp"></ion-icon>
                    </span>
                    <span class="link-text">Home</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {};
</script>

<style scoped>
.navbar-custom {
    position: fixed;
    transition: width 200ms ease;
    z-index: 5;
}

.navbar-nav-custom {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

.logo {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.3ch;
    width: 100%;
    background-color: #e57a00;
}

.logo ion-icon {
    transform: rotate(0deg);
    transition: transform 200ms;
}

.navbar-custom:hover .logo ion-icon {
    transform: rotate(360deg);
}

.nav-link-custom {
    display: flex;
    align-items: center;
    height: 5rem;
    text-decoration: none;
    color: black;
    filter: grayscale(100%) opacity(0.7);
    transition: 200ms;
}

.nav-link-custom:hover {
    filter: grayscale(0%) opacity(1);
    background: #cc6c00;
    color: #ededed;
}

.link-text {
    display: none;
}

.nav-link-custom ion-icon {
    font-size: 2rem;
    margin-right: 1.5rem;
    margin-left: 1.5rem;
}

@media (max-width: 576px) {
    .navbar-custom {
        bottom: 0;
        width: 100vw;
        height: 10vh;
    }

    .logo {
        display: none;
    }

    .navbar-nav-custom {
        flex-direction: row;
        justify-content: space-between;
        height: 100%;
    }

    .nav-item-custom {
        width: 100%;
    }

    .nav-link-custom {
        justify-content: center;
        height: 100%;
    }
}

@media (min-width: 577px) {
    .navbar-custom {
        top: 0;
        width: 5rem;
        height: 100vh;
    }

    .navbar-custom:hover {
        width: 16rem;
    }

    .navbar-custom:hover .link-text {
        display: block;
    }

    .navbar-nav-custom {
        flex-direction: column;
        align-items: center;
    }

    .nav-item-custom {
        width: 100%;
    }
}
</style>
