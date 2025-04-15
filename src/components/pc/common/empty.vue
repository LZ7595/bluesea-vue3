<template>
    <div class="shop-car-empty">
        <img :src="server_URL +'/icon/shop-car-empty.png'" alt="empty" />
        <div>{{ title }}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import {server_URL} from "@/urlConfig.js";
// 定义组件的 props
const props = defineProps({
    title: {
        type: String,
        default: '空空如也'
    }
});
</script>

<style scoped>
.shop-car-empty{
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    color: #999;
    img{
        width: 200px;
        height: 200px;
        margin: 0 auto;
    }
}
</style>