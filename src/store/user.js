import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null
    }),
    persist: {
        enable: true,
        strategies: [
            {
                key: 'token',
                storage: localStorage
            }
        ]
    },
    actions: {
        setUserData(token) {
            this.token = token;
            localStorage.setItem('token', JSON.stringify(token));
        }
    }
});