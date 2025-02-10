import { defineStore } from 'pinia';

export const useScrollStore = defineStore('scroll', {
    state: () => ({
        scrollTop: 0
    }),
    actions: {
        setScrollTop(newScrollTop) {
            this.scrollTop = newScrollTop;
        },
        scrollToPosition(targetPosition) {
            this.scrollTop = targetPosition;
        }
    }
});