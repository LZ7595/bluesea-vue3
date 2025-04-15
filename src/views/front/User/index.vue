<template>
    <div class="div-page">
        <div class="viewport">
            <div class="user-page">
                <div class="user-page-content">
                    <div class="user-page-content-left">
                        <div class="user-page-content-left-item">
                            <h3>我的订单</h3>
                            <ul>
                                <li><router-link :to="{ path: '/pc/user/order', query: { tab: 'first' } }">全部订单</router-link></li>
                                <li><router-link :to="{ path: '/pc/user/order', query: { tab: 'second' } }">待付款</router-link></li>
                                <li><router-link :to="{ path: '/pc/user/order', query: { tab: 'third' } }">待收货</router-link></li>
                                <li><router-link :to="{ path: '/pc/user/order', query: { tab: 'fourth' } }">已完成</router-link></li>
                                <li><router-link :to="{ path: '/pc/user/order', query: { tab: 'fifth' } }">退货/退款</router-link></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的收藏</h3>
                            <ul>
                                <li><a href="#">商品收藏</a></li>
                                <li><a href="#">店铺收藏</a></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的地址</h3>
                            <ul>
                                <li><router-link to="/pc/user/address">收货地址</router-link></li>
                            </ul>
                        </div>
                        <div class="user-page-content-left-item">
                            <h3>我的账户</h3>
                            <ul>
                                <li><router-link :to="{ path: '/pc/user', query: { tab: 'first' } }">个人信息</router-link></li>
                                <li><router-link :to="{ path: '/pc/user', query: { tab: 'second' } }">账户安全</router-link></li>
                            </ul>
                        </div>
                    </div>
                    <div class="user-page-content-right">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped>
.user-page {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    .user-page-content {
        display: flex;
        justify-content: space-between;

        .user-page-content-left {
            width: 170px;

            .user-page-content-left-item {
                padding: 10px 20px;
                background-color: #fff;

                h3 {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                ul {
                    list-style: none;
                    padding: 0;
                    font-size: 14px;

                    li {
                        margin-bottom: 10px;
                    }
                }

            }
        }

        .user-page-content-right {
            width: calc(100% - 190px);
            background-color: #fff;
            box-sizing: border-box;
        }
    }
}

</style>