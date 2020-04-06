<template>
    <div v-if="isDataFetched">
        <div class="jumbotron jumbotron-fluid">
            <div class="container">
                <div class="row no-gutters">
                    <div class="col-md-5 d-flex justify-content-center">
                        <img src="@/assets/logo.png" />
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex flex-column align-items-stretch">
                            <div>
                                <h1 class="display-4">@{{profileOwner.username}}</h1>
                            </div>
                            <div class="d-flex flex-row align-items-center mt-2">
                                <div class="btn btn-danger flex-fill mr-1" @click="displayRatings">
                                    <ion-icon name="videocam" size="large"></ion-icon>
                                    <span class="d-none d-sm-block">Filmy</span>
                                </div>
                                <div class="btn btn-success flex-fill mr-1">
                                    <ion-icon name="stats-chart" size="large"></ion-icon>
                                    <span class="d-none d-sm-block">Statystyki</span>
                                </div>
                                <div
                                    class="btn btn-primary flex-fill mr-1"
                                    v-if="myProfile && isLogged"
                                    @click="displaySettings"
                                >
                                    <ion-icon name="settings" size="large"></ion-icon>
                                    <span class="d-none d-sm-block">Ustawienia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <app-user-ratings
            :user="profileOwner"
            :myProfile="myProfile"
            v-if="showRatings"
            :key="profileOwner.id"
        ></app-user-ratings>
        <app-user-settings :user="user" v-if="showSettings"></app-user-settings>
    </div>
</template>

<script>
import axios from 'axios';
import { getters, actions } from '../store';
import UserSettings from './UserSettings';
import UserRatings from './UserRatings';
export default {
    data() {
        return {
            profileOwner: {},
            myProfile: false,
            isDataFetched: false,
            showSettings: false,
            showRatings: true
        };
    },
    computed: {
        ...getters
    },
    methods: {
        ...actions,
        async getUser() {
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/users/${this.$route.params.username}`
                );

                const { user } = result.data;

                //format date before assigning to variable
                const unlimitedDate = new Date(user.unlimited);
                user.unlimited = unlimitedDate;
                this.profileOwner = user;

                //check if profile owner is the same user as user logged in
                if (this.profileOwner.username === this.user.username) {
                    this.myProfile = true;
                    this.profileOwner = this.user;
                }
                this.isDataFetched = true;
            } catch (err) {
                console.log(err);
                //this.$router.push('/404');
            }
        },
        displaySettings() {
            this.showSettings = true;
            this.showRatings = false;
        },
        displayRatings() {
            this.showSettings = false;
            this.showRatings = true;
        }
    },
    async created() {
        //await this.fetchLoggedUser();
        await this.getUser();
    },
    async beforeRouteUpdate(to, from, next) {
        console.log('beforeUpdate');
        next();
        await this.getUser();
    },
    components: {
        AppUserSettings: UserSettings,
        AppUserRatings: UserRatings
    }
};
</script>

<style scoped>
</style>