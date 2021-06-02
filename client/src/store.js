import Vue from 'vue';
import axios from 'axios';
import { proxy } from './config';

const state = Vue.observable({
    isLogged: false,
    user: {}
});

export const getters = {
    user: () => state.user,
    isLogged: () => state.isLogged
};

export const mutations = {
    setUser: val => {
        state.user = val;
        state.user.unlimited = new Date(state.user.unlimited);
    },
    setStatus: val => (state.isLogged = val)
};

export const actions = {
    async fetchLoggedUser() {
        const jwt = localStorage.getItem('jwt');
        try {
            const result = await axios.get(
                //`http://localhost:3000/api/users/get-me`,
                `${proxy}api/users/get-me`,
                {
                    headers: { Authorization: `Bearer ${jwt}` }
                }
            );
            if (result.data.status === 'success') {
                const { user, isLogged } = result.data;
                mutations.setUser(user);
                mutations.setStatus(isLogged);
            }
            // eslint-disable-next-line no-empty
        } catch (err) {}
    }
};
