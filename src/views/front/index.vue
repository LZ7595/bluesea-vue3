<template>
    <div class="pc-front">
        <div class="pc-header">
            <div class="viewport">
                <div class="rside">
                    <ul class="header-ul">
                        <li v-if="!isLogin">
                            <router-link to="/pc/Auth/Login">登录</router-link>
                        </li>
                        <li v-if="!isLogin">
                            <router-link to="/pc/Auth/Register">注册</router-link>
                        </li>
                        <li v-else class="user-info">
                            <router-link to="/pc/user">
                                <p>{{ userData.username }}</p>
                                <img class="arrow" :src="server_URL + '/icon/topArrow.svg'" alt="箭头"/>
                            </router-link>
                        </li>
                        <div class="user-info-content" v-if="isLogin">
                            <div class="user-info-content-go">
                                <div class="user-info-avatar">
                                    <el-avatar :icon="UserFilled" :src="server_URL + userInfo.avatar" :size="70"/>
                                </div>
                                <div class="user-info-content-div">
                                    <div>
                                        <p class="username">用户名：{{ userInfo.username }}</p>
                                        <p class="user-role">账号类型：{{ userInfo.role }}</p>
                                    </div>
                                    <div class="user-action">
                                        <button @click="logout">退出登录</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <li>
                            <router-link to="/pc/home">首页</router-link>
                        </li>
                        <li>
                            <router-link to="/pc/cart">购物车</router-link>
                        </li>
                        <li>
                            <router-link to="/pc/user/order">我的订单</router-link>
                        </li>
                        <li>
                            <router-link to="/pc/user">账号设置</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="pc-header-search-logo">
            <div class="viewport">
                <div class="search-logo">
                    <router-link to="/pc/home">
                        <div class="logo">
                            <img :src="server_URL + '/icon/logo1.png'" alt=""/>
                        </div>
                    </router-link>
                    <Search/>
                </div>
            </div>
        </div>
        <router-view></router-view>
        <div class="pc-foot">
            <div class="viewport">
                <div class="foot-content">
                    <div class="foot-content-service">
                        <div class="foot-content-service-item" v-for="(item,index) in footServiceList" :key="index">
                            <img :src="server_URL + item.img" alt="" class="foot-content-service-item-icon"/>
                            <div class="foot-content-service-item-text">
                                <p class="row1">{{ item.name }}</p>
                                <p class="row2">{{ item.text }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="foot-content-bar">
                        <div class="foot-content-bar-item" v-for="(item,index) in footBarList" :key="index">
                            <router-link :to="item.url">{{ item.name }}</router-link>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                    <div class="foot-content-text">
                        <p>Copyright © 2024-2025 Blue Ocean Technology Co., Ltd. All rights reserved.</p>
                        <p>蓝海科技 版权所有</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <QuickActionGroup/>
</template>

<script setup>
import Search from "@/components/pc/common/search.vue";
import QuickActionGroup from "@/components/pc/common/quickActionGroup.vue";
import Auth from "@/request/auth";
import {getCookie, parseJwt} from "@/utils/cookieJwt";

import {ref} from "vue";
import {ElMessage} from "element-plus";
import userRes from "@/request/user";
import {UserFilled} from "@element-plus/icons-vue";
import {server_URL} from "@/urlConfig.js";

const footBarList = ref([
    {name: '首页', url: '/pc/home'},
    {name: '关于我们', url: '/pc/about'},
    {name: '联系我们', url: '/pc/about'},
    {name: '加入我们', url: '/pc/about'},
    {name: '管理后台', url: '/admin'}
]);

const footServiceList = ref([
    {name: "正品保证", text: "正品行货 放心选购", img: '/icon/zp.png'},
    {name: "仓库直发", text: "根据收货地址挑选最近仓库", img: '/icon/ck.png'},
    {name: "极速发货", text: "下单24小时内极速发货", img: '/icon/by.png'},
    {name: "售后无忧", text: "7天无理由退货", img: '/icon/sh.png'},
])
const userStore = ref(JSON.parse(localStorage.getItem('token')));

// 从 cookie 中获取 JWT 令牌
const jwtToken = getCookie('token');
// 解析从 cookie 中获取的 JWT 令牌
const userData = ref(userStore.value ? parseJwt(userStore.value) : jwtToken ? parseJwt(jwtToken) : null);
localStorage.setItem('UserData', JSON.stringify(userData.value));
// 判断用户是否登录
const isLogin = ref(!!userData.value);
const userInfo = ref({});

// 退出登录的函数
const logout = async () => {
    try {
        const res = await Auth.logout();
        console.log(res)
        if (res.status === 200) {
            // 清除本地存储的用户信息
            localStorage.removeItem('UserData');
            localStorage.removeItem('token');
            isLogin.value = false;
            ElMessage.success('退出登录成功');
        } else {
            ElMessage.error('退出登录失败');
        }
    } catch (error) {
        console.error('退出登录失败:', error);
        ElMessage.error('退出登录失败');
    }
};
const getUserDetail = async () => {
    try {
        const res = await userRes.getUserInfo(userData.value.id);
        console.log(res)
        userInfo.value = res;
    } catch (err) {
        console.log(err)
        ElMessage.error('获取用户信息失败');
    }
}
if (isLogin.value) {
    getUserDetail();
}
</script>
<style scoped>
.pc-front {
    .pc-header {
        width: 100%;
        min-width: 1200px;
        height: 40px;
        background-color: #f7f7f7;
        padding: 12px 0;

        .rside {
            float: right;

            .header-ul {
                li {
                    float: left;
                    padding: 0 18px;
                    position: relative;
                    overflow: hidden;

                    a {
                        display: flex;
                        align-items: center;

                        p {
                            width: 34px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        img.arrow {
                            transform: rotate(180deg);
                            width: 10px;
                            height: 10px;
                            margin-left: 4px;
                        }
                    }

                    a:hover {
                        color: #5a99dc;
                    }

                }

                li.user-info {
                    width: 84px;
                }

                li.user-info:hover {
                    a {
                        color: #5a99dc;
                    }

                    img.arrow {
                        transform: rotate(0deg);
                        transition: transform 0.3s ease;
                    }
                }

                .user-info-content {
                    display: none;
                    position: absolute;
                    top: 20px;
                    width: 300px;
                    height: 160px;
                    background: none;
                    z-index: 20;
                    padding: 20px 0 10px;

                    .user-info-content-go {
                        position: relative;
                        width: 300px;
                        height: 110px;
                        padding: 20px;
                        background: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        display: flex;
                        font-size: 14px;
                        gap: 30px;

                        .user-info-content-div {
                            display: flex;
                            flex-direction: column;
                            width: 160px;
                            justify-content: space-between;

                            .user-action {
                                display: flex;
                                justify-content: right;
                                margin-top: 10px;

                                button:hover{
                                    color: #5a99dc;
                                }
                            }
                        }

                    }
                }

                .user-info-content:hover {
                    display: block;
                }

                li.user-info:hover + .user-info-content {
                    display: block;
                }

                li:after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 1px;
                    height: 16px;
                    display: block;
                    background-color: #e2e2e2;
                }
            }
        }
    }

    .pc-header-search-logo {
        height: 130px;

        .search-logo {
            display: flex;
            gap: 120px;
            flex-direction: row;
            align-items: center;

            .logo img {
                height: 120px;
                padding: 20px 0;
                box-sizing: border-box;
            }
        }
    }

    .pc-foot {
        width: 100%;
        min-width: 1200px;

        .foot-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0;
            gap: 20px;

            .foot-content-service {
                padding: 20px 0;
                display: flex;
                border-bottom: 1px solid #f5f5f5;

                .foot-content-service-item {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    width: 300px;

                    img.foot-content-service-item-icon {
                        height: 100px;
                        width: 100px;
                    }

                    .foot-content-service-item-text {
                        p.row1 {
                            font-size: 18px;
                        }

                        p.row2 {
                            font-size: 14px;
                            color: #999999;
                        }
                    }
                }
            }

            .foot-content-bar {
                padding: 5px 0;

                .foot-content-bar-item {
                    padding: 0 10px;
                    float: left;
                    position: relative;

                    a:hover {
                        color: #5a99dc;
                    }
                }

                .foot-content-bar-item:after {
                    position: absolute;
                    content: '';
                    width: 1px;
                    height: 13px;
                    background: #000;
                    top: 2px;
                    right: 0;
                }

                .foot-content-bar-item:nth-child(5):after {
                    content: none;
                }
            }

            .foot-content-text {
                text-align: center;
                font-size: 14px;
                color: #999999;
                padding: 10px 0;
            }
        }
    }
}
</style>