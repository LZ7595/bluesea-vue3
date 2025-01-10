<template>
    <div class="pc-front">
        <div class="pc-header">
            <div class="viewport">
                <div class="rside">
                    <ul class="header-ul">
                        <li>
                            <router-link to="/Auth">登录</router-link>
                        </li>
                        <li>
                            <router-link to="/Auth">注册</router-link>
                        </li>
                        <li>
                            <router-link to="">我的订单</router-link>
                        </li>
                        <li>
                            <router-link to="">会员中心</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="pc-header-search-logo">
            <div class="viewport">
                <div class="search-logo">
                    <div class="logo">
                        <img src="../../../public/icon/logo1.png" alt=""/>
                    </div>
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
                                <img :src="item.img" alt="" class="foot-content-service-item-icon"/>
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
</template>

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

                    a:hover {
                        color: #5a99dc;
                    }
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
            gap:20px;

            .foot-content-service{
                padding: 20px 0;
                display: flex;
                border-bottom: 1px solid #f5f5f5;

                .foot-content-service-item{
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    width: 300px;

                    img.foot-content-service-item-icon{
                        height: 100px;
                        width: 100px;
                    }
                    .foot-content-service-item-text{
                        p.row1{
                            font-size:18px;
                        }
                        p.row2{
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

                    a:hover{
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

<script setup>
import Search from "@/components/pc/search.vue";
import {ref} from "vue";

const footBarList = ref([
    {name: '首页', url: ''},
    {name: '关于我们', url: ''},
    {name: '联系我们', url: ''},
    {name: '加入我们', url: ''},
    {name: '管理后台', url: ''}
]);

const footServiceList = ref([
    {name:"正品保证",text:"正品行货 放心选购",img:'../../../public/icon/zp.png'},
    {name:"仓库直发",text:"根据收货地址挑选最近仓库",img:'../../../public/icon/ck.png'},
    {name:"极速发货",text:"下单24小时内极速发货",img:'../../../public/icon/by.png'},
    {name:"售后无忧",text:"7天无理由退货",img:'../../../public/icon/sh.png'},
])
</script>