<template>
    <el-scrollbar height="100vh">
        <div id="app" v-loading.fullscreen.lock="loadingStore.$state.loading">
            <router-view></router-view>
        </div>
    </el-scrollbar>
</template>

<script setup>
import {useLoadingStore} from './store/loading';

const loadingStore = useLoadingStore();
</script>