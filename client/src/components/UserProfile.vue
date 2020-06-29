<template>
    <div v-if="isDataFetched">
        <div class="jumbotron jumbotron-fluid">
            <div class="container">
                <div class="row no-gutters">
                    <div class="col-md-5 d-flex justify-content-center">
                        <img
                            :src="
                                `http://localhost:3000/img/${profileOwner.photo}`
                            "
                            class="rounded-circle"
                        />
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex flex-column align-items-stretch">
                            <div class="text-center text-md-left">
                                <h1 class="display-4">{{ profileOwner.username }}</h1>
                            </div>
                            <div class="d-flex flex-row align-items-center mt-2">
                                <div class="btn btn-danger flex-fill mr-1" @click="displayRatings">
                                    <ion-icon name="videocam" size="large"></ion-icon>
                                    <span class="d-none d-sm-block">Filmy</span>
                                </div>
                                <div class="btn btn-success flex-fill mr-1" @click="displayStats">
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
        <keep-alive>
            <app-user-ratings
                :user="profileOwner"
                :myProfile="myProfile"
                v-if="showRatings"
                :key="profileOwner.id"
            ></app-user-ratings>
        </keep-alive>
        <app-user-settings :user="user" v-if="showSettings" @photoChanged="onPhotoChanged"></app-user-settings>
        <app-user-stats
            :user="profileOwner"
            :loggedUser="user"
            v-if="showStats"
            :key="profileOwner.id"
        ></app-user-stats>
    </div>
</template>

<script>
import axios from 'axios';
import { getters, actions } from '../store';
import UserSettings from './UserSettings';
import UserRatings from './UserRatings';
import UserStats from './UserStats';
export default {
    data() {
        return {
            profileOwner: {},
            myProfile: false,
            isDataFetched: false,
            showSettings: false,
            showRatings: true,
            showStats: false
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
                //const unlimitedDate = new Date(user.unlimited);
                //user.unlimited = unlimitedDate;
                this.profileOwner = user;

                //check if profile owner is the same user as user logged in
                if (this.profileOwner.username === this.user.username) {
                    this.myProfile = true;
                    this.profileOwner = this.user;
                }
                this.isDataFetched = true;
                //console.log(this.profileOwner);
            } catch (err) {
                //console.log(err);
                this.$router.push('/404');
            }
        },
        displaySettings() {
            this.showStats = false;
            this.showRatings = false;
            this.showSettings = true;
        },
        displayRatings() {
            this.showStats = false;
            this.showSettings = false;
            this.showRatings = true;
        },
        displayStats() {
            this.showSettings = false;
            this.showRatings = false;
            this.showStats = true;
        },
        onPhotoChanged(photo) {
            this.profileOwner.photo = photo;
        }
    },
    async created() {
        //await this.fetchLoggedUser();
        await this.getUser();
    },
    async beforeRouteUpdate(to, from, next) {
        //console.log('beforeUpdate');
        next();
        await this.getUser();
    },
    components: {
        AppUserSettings: UserSettings,
        AppUserRatings: UserRatings,
        AppUserStats: UserStats
    }
};
</script>

<style scoped></style>
