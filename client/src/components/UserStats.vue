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
        <div class="alert alert-danger" v-if="error">
            {{ user.username }} nie ocenił jeszcze żadnego filmu
        </div>
        <div v-else>
            <div class="mt-2 rounded bg-light p-3">
                <h1 class="display-md-4">Twoje podsumowanie!</h1>
                <hr class="my-4 bg-warning" />
                <div class="card-columns">
                    <div class="card text-center bg-info mb-3">
                        <div class="card-body">
                            <h5>Pieniądze wydane na abonament</h5>
                            <h4 class="display-4">
                                💵 {{ stats.subscription }} zł
                            </h4>
                        </div>
                    </div>

                    <div
                        class="card text-center mb-3"
                        style="background: #00796B;"
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

                    <div class="card text-center bg-primary mb-3">
                        <div class="card-body">
                            <h5>
                                Pieniądze, które wydane by były bez abonamentu
                            </h5>
                            <h4 class="display-4">
                                💸{{ stats.moneyWoSubscription }} zł
                            </h4>
                        </div>
                    </div>

                    <div
                        class="card text-center mb-3"
                        style="background: #00796B;"
                    >
                        <div class="card-body">
                            <h5>Przedpremierowe seanse</h5>
                            <h4 class="display-4">
                                📅 {{ stats.preReleases }}
                            </h4>
                        </div>
                    </div>

                    <div class="card text-center bg-secondary mb-3">
                        <div class="card-body">
                            <h5>Czas spędzony w kinie</h5>
                            <h4 class="display-4">
                                💺
                                <br />
                                {{ parseInt(stats.timeCount / 60, 10) }}h
                                {{ stats.timeCount % 60 }}min
                            </h4>
                        </div>
                    </div>
                </div>
                <h4 class="mt-2">Rozkład ocen</h4>
                <column-chart :data="stats.ratings"></column-chart>
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
            error: false
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
