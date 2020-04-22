<template>
    <div class="container">
        <div class="row">
            <div class="col-auto">
                <datepicker
                    :clear-button="true"
                    placeholder="od"
                    v-model="from"
                    :bootstrap-styling="true"
                    @input="getStats"
                />
            </div>
            <div class="col-auto">
                <datepicker
                    :clear-button="true"
                    placeholder="do"
                    v-model="to"
                    :bootstrap-styling="true"
                    @input="getStats"
                />
            </div>
        </div>
        <div
            class="alert alert-danger"
            v-if="error"
        >{{ user.username }} nie ocenił jeszcze żadnego filmu</div>
        <div v-else>
            <div class="mt-2 rounded bg-light p-3">
                <h1 class="display-md-4">Twoje podsumowanie!</h1>
                <hr class="my-4 bg-warning" />
                <div class="card-columns">
                    <div class="card text-center bg-info mb-3">
                        <div class="card-body">
                            <h5>Pieniądze wydane na abonament</h5>
                            <h4 class="display-4">💵 {{ stats.subscription }} zł</h4>
                        </div>
                    </div>

                    <div class="card text-center mb-3" style="background: #00796B;">
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

                    <div class="card text-center bg-primary mb-3">
                        <div class="card-body">
                            <h5>Pieniądze, które wydane by były bez abonamentu</h5>
                            <h4 class="display-4">💸{{ stats.moneyWoSubscription }} zł</h4>
                        </div>
                    </div>

                    <div class="card text-center">
                        <div class="card-body">
                            <h5>Liczba seansów</h5>
                            <h4 class="display-4">🎦{{stats.moviesWatched}}</h4>
                        </div>
                    </div>

                    <div class="card text-center bg-secondary mb-3">
                        <div class="card-body">
                            <h5>Czas spędzony w kinie</h5>
                            <h2>
                                💺
                                {{ parseInt(stats.timeCount / 60, 10) }}h
                                {{ stats.timeCount % 60 }}m
                            </h2>
                        </div>
                    </div>

                    <div class="card text-center mb-3" style="background: #00796B;">
                        <div class="card-body">
                            <h5>Przedpremierowe seanse</h5>
                            <h4 class="display-4">📅 {{ stats.preReleases }}</h4>
                        </div>
                    </div>
                </div>

                <!-- ROZKŁAD OCEN -->
                <h4 class="mt-2 text-muted">Rozkład ocen</h4>
                <column-chart :data="stats.ratings" xtitle="⭐Ocena" :library="chartOptions"></column-chart>
                <div class="card text-center mt-1">
                    <div class="card-body">
                        <h5>Średnia ocen</h5>
                        <h4 class="display-4">⭐{{stats.avgRating.toFixed(2)}}</h4>
                    </div>
                </div>

                <!-- Ulubieni twórcy -->
                <h4 class="text-muted">Ulubieni twórcy</h4>
                <bar-chart :data="stats.directors" :library="chartOptions"></bar-chart>

                <!-- Ulubione gatunki -->
                <h4 class="text-muted">Ulubione gatunki</h4>
                <bar-chart :data="stats.genres" :library="chartOptions"></bar-chart>

                <!-- Liczba obejrzanych filmów ze względu na kraj produkcji -->
                <h4 class="text-muted">Liczba obejrzanych filmów ze względu na kraj produkcji</h4>
                <geo-chart
                    :data="stats.countries"
                    :library="{backgroundColor: '#222'}"
                    adapter="google"
                ></geo-chart>
                <div class="card text-center mt-1">
                    <div class="card-body">
                        <h4>Obejrzałeś/aś filmy z {{stats.countriesCount}} różnych krajów 🌎</h4>
                    </div>
                </div>

                <!-- Sale kinowe -->
                <h4 class="text-muted">Sale kinowe</h4>
                <pie-chart :data="stats.screens"></pie-chart>

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
            stats: [],
            from: null,
            to: null,
            error: false,
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
    props: ['user'],
    computed: {
        fromDate() {
            if (this.from) return new Date(this.from).getTime();
            return new Date(0).getTime();
        },
        toDate() {
            if (this.to) return new Date(this.to).getTime();
            return new Date().getTime();
        }
    },
    methods: {
        async getStats() {
            this.error = false;
            console.log(
                `http://localhost:3000/api/users/${this.user.id}/stats?from=${this.fromDate}&to=${this.toDate}`
            );
            try {
                const result = await axios.get(
                    `http://localhost:3000/api/users/${this.user.id}/stats?from=${this.fromDate}&to=${this.toDate}`
                );
                this.stats = result.data.stats;
                console.log(this.stats);
            } catch (err) {
                this.error = true;
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
