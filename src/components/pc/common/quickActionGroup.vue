<template>
    <div class="quick-action-group">
        <el-tooltip
                effect="light"
                content="购物车"
                placement="left"
        >
            <router-link to="/pc/cart">
                <div class="quick-action-item">
                    <el-icon>
                        <ShoppingCart/>
                    </el-icon>
                </div>
            </router-link>
        </el-tooltip>
        <el-tooltip
                effect="light"
                content="客服"
                placement="left"
        >
            <router-link to="/im">
                <div class="quick-action-item">
                    <el-icon>
                        <ChatLineRound/>
                    </el-icon>
                </div>
            </router-link>
        </el-tooltip>
        <div class="quick-action-item" @click="scrollToTop">
            <el-icon>
                <Top/>
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import {ShoppingCart, ChatLineRound, Top} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useScrollStore} from '@/store/common';

const scrollStore = useScrollStore();

const scrollToTop = () => {
    const scrollStep = () => {
        const currentScrollTop = scrollStore.scrollTop;
        if (currentScrollTop > 0) {
            window.requestAnimationFrame(scrollStep);
            const newScrollTop = Math.max(currentScrollTop - 50, 0);
            scrollStore.scrollToPosition(newScrollTop);
        }
    };
    scrollStep();
};
</script>

<style scoped>
.quick-action-group {
    position: fixed;
    top: 40%;
    right: 20px;
    transform: translateY(-50%);
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .quick-action-item {
        width: 45px;
        height: 45px;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 23px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .quick-action-item:hover {
        background-color: #5a99dc;
        color: white;
    }
}
</style>