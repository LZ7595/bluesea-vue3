<template>
    <el-scrollbar ref="scrollbarRef" height="100vh">
        <div id="app" v-loading.fullscreen.lock="loadingStore.$state.loading">
            <router-view></router-view>
        </div>
    </el-scrollbar>
</template>

<script setup>
import {useLoadingStore} from './store/loading';
import {ref, onMounted, watch} from 'vue';
import { useScrollStore } from './store/common';

const loadingStore = useLoadingStore();
const scrollbarRef = ref(null);
const scrollStore = useScrollStore();

onMounted(() => {
    const scrollContainer = scrollbarRef.value?.wrapRef;
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            scrollStore.setScrollTop(scrollContainer.scrollTop);
        });

        // 监听 Pinia 中滚动位置的变化，同步到 ElScrollbar
        watch(() => scrollStore.scrollTop, (newScrollTop) => {
            scrollContainer.scrollTop = newScrollTop;
        });
    }
});
</script>