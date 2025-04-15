import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
        startTime: 0
    }),
    actions: {
        startLoading() {
            this.loading = true;
            this.startTime = Date.now();
        },
        stopLoading() {
            const elapsedTime = Date.now() - this.startTime;
            const delay = Math.max(500 - elapsedTime, 0);
            setTimeout(() => {
                this.loading = false;
            }, delay);
        }
    }
});