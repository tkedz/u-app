<template>
    <div class="container">
        <div class="row">
            <div class="col-auto">
                <datepicker
                    :clear-button="true"
                    placeholder="od"
                    v-model="from"
                    :bootstrap-styling="true"
                    @input="getStats(); compareStats(false);"
                />
            </div>
            <div class="col-auto">
                <datepicker
                    :clear-button="true"
                    placeholder="do"
                    v-model="to"
                    :bootstrap-styling="true"
                    @input="getStats(); compareStats(false);"
                />
            </div>
        </div>
        <div
            class="alert alert-danger"
            v-if="error"
        >{{ user.username }} nie ocenił jeszcze żadnego filmu</div>
        <div v-else>
            <div class="mt-2 rounded bg-light p-3">
                <div class="clearfix">
                    <h1 class="display-md-4 float-left" v-if="myProfile">Twoje podsumowanie!</h1>
                    <h1 class="display-md-4 float-left" v-else>Statystyki dla {{user.username}}</h1>
                    <button
                        class="btn btn-primary btn-lg float-right my-auto"
                        v-if="!myProfile"
                        @click="compareStats(true)"
                    >Porównaj / Zatrzymaj porównywanie</button>
                </div>
                <hr class="my-4 bg-warning" />
                <div class="card-columns">
                    <div class="card text-center bg-info mb-3" v-if="myProfile">
                        <div class="card-body">
                            <h5>Pieniądze wydane na abonament</h5>
                            <h4 class="display-4">💵 {{ stats.subscription }} zł</h4>
                        </div>
                    </div>

                    <div
                        class="card text-center mb-3"
                        style="background: #00796B;"
                        v-if="myProfile"
                    >
                        <div class="card-body">
                            <h5>Zaoszczędzone</h5>
                            <h4 class="display-4">
                                💰
                                {{
                                stats.moneyWoSubscription -
                                stats.subscription
                                }}
                                zł
                            </h4>
                        </div>
                    </div>

                    <div class="card text-center bg-primary mb-3" v-if="myProfile">
                        <div class="card-body">
                            <h5>Pieniądze, które wydane by były bez abonamentu</h5>
                            <h4 class="display-4">💸{{ stats.moneyWoSubscription }} zł</h4>
                        </div>
                    </div>

                    <div class="card text-center">
                        <div class="card-body">
                            <h5>
                                Liczba seansów
                                <span v-if="isComparision">🎦</span>
                            </h5>
                            <h4 class="display-4" v-if="!isComparision">🎦{{stats.moviesWatched}}</h4>
                            <h4 class="display-4" v-else>
                                <span class="text-primary">{{stats.moviesWatched}}</span> 🆚
                                <span class="text-warning">{{compare.moviesWatched}}</span>
                            </h4>
                        </div>
                    </div>

                    <div class="card text-center bg-secondary mb-3">
                        <div class="card-body">
                            <h5>
                                Czas spędzony w kinie
                                <span v-if="isComparision">💺</span>
                            </h5>
                            <h2 v-if="!isComparision">
                                💺
                                {{ parseInt(stats.timeCount / 60, 10) }}h
                                {{ stats.timeCount % 60 }}m
                            </h2>
                            <h2 v-else>
                                <span class="text-primary">
                                    {{ parseInt(stats.timeCount / 60, 10) }}h
                                    {{ stats.timeCount % 60 }}m
                                </span> 🆚
                                <span class="text-warning">
                                    {{ parseInt(compare.timeCount / 60, 10) }}h
                                    {{ compare.timeCount % 60 }}m
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div class="card text-center mb-3" style="background: #00796B;">
                        <div class="card-body">
                            <h5>
                                Przedpremiery
                                <span v-if="isComparision">📅</span>
                            </h5>
                            <h4 class="display-4" v-if="!isComparision">📅 {{ stats.preReleases }}</h4>
                            <h4 class="display-4" v-else>
                                <span class="text-primary">{{ stats.preReleases }}</span> 🆚
                                <span class="text-warning">{{compare.preReleases}}</span>
                            </h4>
                        </div>
                    </div>
                </div>

                <!-- ROZKŁAD OCEN -->
                <h4 class="mt-2 text-muted">Rozkład ocen</h4>
                <column-chart
                    :data="ratingsData"
                    xtitle="⭐Ocena"
                    :library="chartOptions"
                    :colors="['#2A9FD6','#FF8800']"
                ></column-chart>
                <div class="card text-center mt-1">
                    <div class="card-body">
                        <h5>
                            Średnia ocen
                            <span v-if="isComparision">⭐</span>
                        </h5>
                        <h4 class="display-4" v-if="!isComparision">⭐{{stats.avgRating.toFixed(2)}}</h4>
                        <h4 class="display-4" v-else>
                            <span class="text-primary">{{stats.avgRating.toFixed(2)}}</span> 🆚
                            <span class="text-warning">{{compare.avgRating.toFixed(2)}}</span>
                        </h4>
                    </div>
                </div>

                <!-- Ulubieni twórcy -->
                <h4 class="text-muted">Ulubieni twórcy</h4>
                <bar-chart
                    :data="directorsData"
                    :library="chartOptions"
                    :colors="['#2A9FD6','#FF8800']"
                ></bar-chart>

                <!-- Ulubione gatunki -->
                <h4 class="text-muted">Ulubione gatunki</h4>
                <bar-chart
                    :data="genresData"
                    :library="chartOptions"
                    :colors="['#2A9FD6','#FF8800']"
                ></bar-chart>

                <!-- Liczba obejrzanych filmów ze względu na kraj produkcji -->
                <h4 class="text-muted">Liczba obejrzanych filmów ze względu na kraj produkcji</h4>
                <geo-chart
                    :data="stats.countries"
                    :library="{backgroundColor: '#222', colorAxis: {colors: ['#71c7ec','#005073']}}"
                    adapter="google"
                ></geo-chart>
                <div
                    class="card text-center mt-1"
                    :class="{'bg-primary': isComparision, 'text-white': isComparision}"
                >
                    <div class="card-body">
                        <h4
                            v-if="myProfile"
                        >Obejrzałeś/aś filmy z {{stats.countriesCount}} różnych krajów 🌎</h4>
                        <h4
                            v-else
                        >{{user.username}} obejrzał/a filmy z {{stats.countriesCount}} różnych krajów 🌎</h4>
                    </div>
                </div>
                <geo-chart
                    :data="compare.countries"
                    :library="{backgroundColor: '#222'}"
                    adapter="google"
                    v-if="isComparision"
                ></geo-chart>
                <div class="card text-center mt-1 bg-warning text-white" v-if="isComparision">
                    <div class="card-body">
                        <h4>Obejrzałeś/aś filmy z {{compare.countriesCount}} różnych krajów 🌎</h4>
                    </div>
                </div>

                <!-- Sale kinowe -->
                <h4 class="text-muted">Sale kinowe</h4>
                <div class="alert alert-primary text-center" v-if="isComparision">
                    <h4 class="alert-heading">{{user.username}}</h4>
                </div>
                <pie-chart :data="stats.screens"></pie-chart>
                <div class="alert alert-warning text-center" v-if="isComparision">
                    <h4 class="alert-heading">{{loggedUser.username}}</h4>
                </div>
                <pie-chart :data="compare.screens" v-if="isComparision"></pie-chart>

                <hr class="bg-warning" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';

export default {
    data() {
        return {
            stats: {},
            compare: {},
            from: null,
            to: null,
            error: false,
            isComparision: false,
            chartOptions: {
                legend: {
                    labels: {
                        fontColor: 'white'
                    }
                },
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                fontColor: 'white'
                            },
                            ticks: {
                                fontColor: 'white',
                                beginAtZero: true
                            }
                        }
                    ],
                    xAxes: [
                        {
                            scaleLabel: {
                                fontColor: 'white'
                            },
                            ticks: {
                                fontColor: 'white',
                                beginAtZero: true
                            }
                        }
                    ]
                }
            }
        };
    },
    props: ['user', 'loggedUser'],
    computed: {
        fromDate() {
            if (this.from) return new Date(this.from).getTime();
            return new Date(0).getTime();
        },
        toDate() {
            if (this.to) return new Date(this.to).getTime();
            return new Date().getTime();
        },
        myProfile() {
            if (this.user.id === this.loggedUser.id) return true;
            return false;
        },
        ratingsData() {
            if (!this.isComparision) return this.stats.ratings;

            return [
                { name: this.user.username, data: this.stats.ratings },
                { name: this.loggedUser.username, data: this.compare.ratings }
            ];
        },
        directorsData() {
            if (!this.isComparision) return this.stats.directors;

            return [
                { name: this.user.username, data: this.stats.directors },
                { name: this.loggedUser.username, data: this.compare.directors }
            ];
        },
        genresData() {
            if (!this.isComparision) return this.stats.genres;

            return [
                { name: this.user.username, data: this.stats.genres },
                { name: this.loggedUser.username, data: this.compare.genres }
            ];
        }
    },
    methods: {
        async getStats() {
            this.error = false;
            const jwt = localStorage.getItem('jwt');
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/users/${this.user.id}/stats?from=${this.fromDate}&to=${this.toDate}`,
                    {
                        headers: { Authorization: `Bearer ${jwt}` }
                    }
                );
                this.stats = result.data.stats;
                //console.log(this.stats);
            } catch (err) {
                this.error = true;
            }
        },
        async compareStats(toggle) {
            if (toggle) this.isComparision = !this.isComparision;
            // const compareStatsNotLoaded =
            //     Object.keys(this.compare).length === 0 &&
            //     this.compare.constructor === Object;

            if (this.isComparision) {
                try {
                    const result = await axios.get(
                        `http://localhost:3000/api/users/${this.loggedUser.id}/stats?from=${this.fromDate}&to=${this.toDate}`
                    );
                    this.compare = result.data.stats;
                    console.log(this.compare);
                } catch (err) {
                    alert('Nie masz żadnych ocen');
                }
            }
        }
    },
    created() {
        this.getStats();
    },
    components: {
        Datepicker
    }
};
</script>

<style scoped></style>
