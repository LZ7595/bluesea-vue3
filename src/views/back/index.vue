<template>
    <div class="back-div">
        <div class="back-header">
            <div class="back-header-left">
                <div class="back-header-left-logo">
                    <img src="/icon/logo3.png" alt="">
                </div>
                <div class="back-header-left-title">后台管理系统</div>
            </div>
            <div class="back-header-right">
                <!-- 在视口宽度小于等于 1024px 时显示 -->
                <div v-if="!isLargeScreen" class="mobile-menu">
                    <div class="back-header-right-user">
                        <el-icon>
                            <User />
                        </el-icon>
                    </div>
                    <div class="back-header-right-menu" @click="toggleIcon">
                        <el-icon v-if="isMenuVisible">
                            <Menu />
                        </el-icon>
                        <el-icon v-else>
                            <CloseBold />
                        </el-icon>
                    </div>
                </div>
                <!-- 在视口宽度大于 1024px 时显示 -->
                <div v-else class="pc-menu">
                    <div class="back-header-right-user">
                        {{ userData.username }}
                    </div>
                    <div class="back-header-right-logout" @click="logout">
                        退出登录
                    </div>
                </div>
            </div>
        </div>
        <div class="back-content">
            <!-- 为 back-left 添加动态类名 -->
            <div :class="['back-left', {'slide-in':!isMenuVisible || isLargeScreen, 'slide-out': isMenuVisible &&!isLargeScreen}]">
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-vertical-demo"
                    router
                    @select="onMenuSelect"
                >
                    <el-menu-item index="/admin/home">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>后台主页</span>
                    </el-menu-item>
                    <el-sub-menu index="product">
                        <template #title>
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="/admin/product">商品管理</el-menu-item>
                        <el-menu-item index="/admin/category">分类管理</el-menu-item>
                        <el-menu-item index="/admin/promotion">促销管理</el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/admin/order">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/service">
                        <el-icon>
                            <MessageBox />
                        </el-icon>
                        <span>客服对话</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/user">
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/setting">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>系统设置</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div
                v-if="!isMenuVisible &&!isLargeScreen"
                class="overlay"
                @click="toggleIcon"
            ></div>
            <div class="main-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    CloseBold, Menu, User, Document,
    Setting, Avatar, MessageBox, List,
    HomeFilled, Search
} from '@element-plus/icons-vue';
import { ref, onMounted, watch } from 'vue';
import {getCookie, parseJwt} from "@/utils/cookieJwt";
import {ElMessage} from "element-plus";
import Auth from "@/request/auth";
import {useRoute} from "vue-router";

const isMenuVisible = ref(true);
const drawer = ref(false);
const isLargeScreen = ref(window.innerWidth > 1024);
const route = useRoute();
const activeIndex = ref(route.path);

watch(route, (newRoute) => {
    activeIndex.value = newRoute.path;
});

const userStore = ref(JSON.parse(localStorage.getItem('token')));

// 从 cookie 中获取 JWT 令牌
const jwtToken = getCookie('token');
// 解析从 cookie 中获取的 JWT 令牌
const userData = ref(userStore.value ? parseJwt(userStore.value) : jwtToken ? parseJwt(jwtToken) : null);
const toggleIcon = () => {
    if (!isLargeScreen.value) {
        isMenuVisible.value = !isMenuVisible.value;
        drawer.value = !drawer.value;
    }
};

const onMenuSelect = () => {
    if (!isMenuVisible.value &&!isLargeScreen.value) {
        toggleIcon();
    }
};

const handleResize = () => {
    isLargeScreen.value = window.innerWidth > 1024;
    if (isLargeScreen.value) {
        isMenuVisible.value = false; // 视口宽度大于 1024px 时，强制显示菜单
    }
};

const logout = async () => {
    try {
        const res = await Auth.logout();
        console.log(res)
        if (res.status === 200) {
            // 清除本地存储的用户信息
            localStorage.removeItem('UserData');
            localStorage.removeItem('token');
            ElMessage.success('退出登录成功');
        } else {
            ElMessage.error('退出登录失败');
        }
    } catch (error) {
        console.error('退出登录失败:', error);
        ElMessage.error('退出登录失败');
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

watch(isLargeScreen, (newValue) => {
    if (newValue) {
        isMenuVisible.value = false; // 视口宽度变为大于 1024px 时，强制显示菜单
    }else {
        isMenuVisible.value = true;
    }
});
</script>

<style scoped>
.back-div {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.back-header {
    width: 100vw;
    height: 60px;
    background: #5a99dc;
    position: relative;
    z-index: 7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.back-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.back-header-left-logo {
    height: 40px;
}

.back-header-left-logo img {
    width: 100%;
    height: 100%;
}

.back-header-left-title {
    height: 40px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
}

.back-header-right {
    color: #fff;

    .mobile-menu{
        display: flex;
        gap: 10px;
        font-size: 24px;
    }
    .pc-menu{
        display: flex;
        gap: 15px;
        font-size: 16px;
    }
}

.back-header-right-logout,
.back-header-right-menu,
.back-header-right-user {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.back-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    background: #f0f2f5;
}

.back-left {
    width: 200px;
    height: 100%;
    background: #fff;
    transform: translateX(-200px); /* 初始隐藏 */
    transition: transform 0.3s ease;
    z-index: 6;
}

.slide-in {
    transform: translateX(0);
}

.slide-out {
    transform: translateX(-200px);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
    display: none;
}

.main-content {
    flex: 1;
    padding: 1.953vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1vw;
}

@media (min-width: 1025px) {
    .back-left {
        transform: translateX(0); /* 视口宽度大于 1024px 时，强制显示菜单 */
    }

    .overlay {
        display: none; /* 视口宽度大于 1024px 时，隐藏黑幕 */
    }

    .main-content{
        padding: 20px;
    }
}
@media (max-width: 1024px) {
    .back-left {
        position: fixed;
        top: 60px; /* 菜单栏高度 */
        left: 0;
        height: calc(100% - 60px); /* 减去菜单栏高度 */
        width: 200px;
        background: #fff;
        z-index: 6;
        transition: transform 0.3s ease;
    }

    .overlay {
        display: block;
    }
}
</style>