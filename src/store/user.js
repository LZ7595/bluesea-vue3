import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null,
        role: null,
        token: null
    }),
    persist: {
        enable: true,
        strategies: [
            {
                key: 'UserData',
                storage: localStorage
            }
        ]
    },
    actions: {
        setUserData({ username, role, token }) {
            this.username = username;
            this.role = role;
            this.token = token;
            localStorage.setItem('UserData', JSON.stringify({ username, role, token }));
        }
    }
});